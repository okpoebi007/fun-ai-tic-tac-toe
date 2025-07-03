
import { useState } from "react";
import { Player } from "@/utils/aiLogic";
import { IconStyle } from "@/services/settingsService";

interface EnhancedGameCellProps {
  value: Player;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
  iconStyle: IconStyle;
  currentPlayer: Player;
  previewEnabled?: boolean;
}

const getIconDisplay = (player: Player, iconStyle: IconStyle): string => {
  if (player === '') return '';
  
  switch (iconStyle) {
    case 'emoji':
      return player === 'X' ? '❌' : '⭕';
    case 'modern':
      return player === 'X' ? '✖' : '○';
    case 'classic':
    default:
      return player;
  }
};

const EnhancedGameCell = ({ 
  value, 
  onClick, 
  isWinning, 
  disabled, 
  iconStyle, 
  currentPlayer,
  previewEnabled = true 
}: EnhancedGameCellProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const showPreview = previewEnabled && isHovered && value === '' && !disabled;
  const displayValue = showPreview 
    ? getIconDisplay(currentPlayer, iconStyle)
    : getIconDisplay(value, iconStyle);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 
        flex items-center justify-center 
        text-2xl sm:text-3xl font-bold 
        rounded-lg border-2 border-gray-300 dark:border-gray-600
        transition-all duration-300 ease-in-out
        transform active:scale-95
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${isWinning ? 'bg-green-400 border-green-500 text-white animate-pulse' : 
          'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}
        ${showPreview ? 'bg-gray-100 dark:bg-gray-700' : ''}
      `}
    >
      <span 
        className={`
          transition-all duration-200
          ${value === 'X' ? 'text-blue-600 dark:text-blue-400' : 
            value === 'O' ? 'text-red-600 dark:text-red-400' : ''}
          ${showPreview ? 'opacity-50 scale-90' : value ? 'animate-in zoom-in-50 duration-300' : ''}
        `}
      >
        {displayValue}
      </span>
    </button>
  );
};

export default EnhancedGameCell;
