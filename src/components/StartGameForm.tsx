
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Input } from './ui/input';
import { ArrowRight, Users } from 'lucide-react';

const StartGameForm = () => {
  const { startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [aiCount, setAiCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    
    setIsLoading(true);
    // Simulate loading for smoother transition
    setTimeout(() => {
      startGame(playerName, aiCount);
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.div
      className="w-full max-w-md glass-panel p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Start New Game</h2>
      
      <form onSubmit={handleStartGame} className="space-y-6">
        <div className="space-y-2">
          <label className="text-white/90 text-sm font-medium">Your Name</label>
          <Input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            required
            autoFocus
            maxLength={15}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-white/90 text-sm font-medium flex items-center">
            <Users size={16} className="mr-2" />
            Number of AI Opponents
          </label>
          <div className="flex items-center justify-between bg-white/10 rounded-md p-1">
            {[1, 2, 3].map((num) => (
              <motion.button
                key={num}
                type="button"
                className={`relative flex-1 py-2 rounded-md text-center ${
                  aiCount === num 
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
                onClick={() => setAiCount(num)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {aiCount === num && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-md z-0"
                    layoutId="activePlayers"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{num}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        <motion.button
          type="submit"
          className="w-full btn-primary flex items-center justify-center space-x-2"
          disabled={!playerName.trim() || isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Start Game</span>
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default StartGameForm;
