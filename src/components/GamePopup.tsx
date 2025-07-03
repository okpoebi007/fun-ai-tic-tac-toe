
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GamePopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const GamePopup = ({ show, message, onClose }: GamePopupProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-xl animate-in zoom-in-50 duration-300">
        <div className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {message}
        </div>
        <Button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GamePopup;
