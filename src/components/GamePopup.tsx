import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GamePopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
  isDrawResult?: boolean;
}

const GamePopup = ({ 
  show, 
  message, 
  onClose, 
  autoCloseDelay = 3000,
  isDrawResult = false 
}: GamePopupProps) => {
  useEffect(() => {
    if (show) {
      // Auto-close after specified delay (1.5 seconds for draws, 3 seconds for others)
      const delay = isDrawResult ? 1500 : autoCloseDelay;
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoCloseDelay, isDrawResult]);

  if (!show) return null;

  const isDraw = message.includes("draw") || isDrawResult;
  const isSeriesComplete = message.includes("series") || message.includes("match");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-xl animate-in zoom-in-50 duration-300 max-w-sm w-full ${
        isDraw ? 'border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 
        isSeriesComplete ? 'border-2 border-purple-400' : 
        'border-2 border-blue-400'
      }`}>
        <div className={`text-2xl font-bold mb-4 ${
          isDraw 
            ? 'text-yellow-600 dark:text-yellow-400' 
            : isSeriesComplete
            ? 'text-purple-600 dark:text-purple-400'
            : 'text-gray-800 dark:text-white'
        }`}>
          {message}
        </div>
        
        {/* Show different styling for draw messages */}
        {isDraw && (
          <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
            All squares filled - no winner this round!
          </div>
        )}
        
        {/* Show series completion info */}
        {isSeriesComplete && (
          <div className="text-sm text-purple-600 dark:text-purple-400 mb-4">
            Series complete!
          </div>
        )}
        
        <Button
          onClick={onClose}
          className={`px-6 py-2 rounded-lg ${
            isDraw 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : isSeriesComplete
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GamePopup;