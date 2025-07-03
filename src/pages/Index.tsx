
import { useEffect } from "react";
import TicTacToeGame from "@/components/TicTacToeGame";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <ThemeToggle />
      <TicTacToeGame />
    </div>
  );
};

export default Index;
