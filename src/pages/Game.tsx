
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameProvider, useGame } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';
import StartGameForm from '@/components/StartGameForm';
import GameOverModal from '@/components/GameOverModal';

// Wrapper component that uses the game context
const GameContent = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();
  
  const isGameStarted = state.players.length > 0;
  const isGameOver = state.gameStatus === 'finished';
  
  const handlePlayAgain = () => {
    resetGame();
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
