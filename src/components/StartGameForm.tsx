
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';

const StartGameForm = () => {
  const [playerName, setPlayerName] = useState('');
  const [aiPlayerCount, setAiPlayerCount] = useState(3);
  const { startGame } = useGame();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use a default name if none provided
    const name = playerName.trim() || 'Player';
    startGame(name, aiPlayerCount);
  };
  
  return (
    <motion.div
      className="max-w-md w-full glass-panel p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Start UNO Game
      </motion.h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="playerName" className="block text-sm font-medium text-white">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="aiPlayers" className="block text-sm font-medium text-white">
            AI Opponents
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setAiPlayerCount(Math.max(1, aiPlayerCount - 1))}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 hover:bg-white/20"
            >
              -
            </button>
            <span className="text-xl text-white font-medium w-8 text-center">
              {aiPlayerCount}
            </span>
            <button
              type="button"
              onClick={() => setAiPlayerCount(Math.min(3, aiPlayerCount + 1))}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20 hover:bg-white/20"
            >
              +
            </button>
          </div>
        </motion.div>
        
        <motion.button
          type="submit"
          className="btn-primary w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Game
        </motion.button>
      </form>
    </motion.div>
  );
};

export default StartGameForm;
