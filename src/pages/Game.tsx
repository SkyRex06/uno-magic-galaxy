
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameProvider, useGame } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';
import StartGameForm from '@/components/StartGameForm';
import GameOverModal from '@/components/GameOverModal';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

// Wrapper component that uses the game context
const GameContent = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();
  const [gameStarting, setGameStarting] = useState(false);
  
  const isGameStarted = state.players.length > 0;
  const isGameOver = state.gameStatus === 'finished';
  
  // Show first turn notification when game starts
  useEffect(() => {
    if (isGameStarted && state.gameStatus === 'playing') {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (currentPlayer && !gameStarting) {
        toast({
          title: "Game Started!",
          description: `${currentPlayer.name} goes first.`,
          variant: "default",
        });
      }
    }
  }, [isGameStarted, state.gameStatus, state.currentPlayerIndex, gameStarting, state.players]);
  
  const handlePlayAgain = () => {
    setGameStarting(true);
    resetGame();
    setTimeout(() => setGameStarting(false), 100);
  };
  
  const handleMainMenu = () => {
    resetGame();
    navigate('/');
  };
  
  return (
    <div className="game-bg min-h-screen flex flex-col justify-between items-center relative overflow-hidden">
      {!isGameStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full p-6">
          <StartGameForm />
        </div>
      ) : (
        <div className="flex-1 w-full max-w-7xl flex flex-col">
          <AnimatePresence>
            {state.gameStatus === 'playing' && (
              <motion.div 
                className="fixed top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 max-w-xs text-white text-xs z-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <Info size={12} className="mr-1 text-blue-300" />
                  <span className="text-blue-300">Tip:</span>
                </div>
                <p className="mt-1">
                  Remember to call "UNO" when you have one card left, or other players can catch you!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <GameBoard />
        </div>
      )}
      
      <GameOverModal
        isOpen={isGameOver}
        winner={state.winner}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
      />
    </div>
  );
};

// Main container component with provider
const Game = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Game;
