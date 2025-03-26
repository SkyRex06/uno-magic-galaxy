
import { motion } from 'framer-motion';

interface GameStatusProps {
  lastAction: string;
  gameDirection: 'clockwise' | 'counter-clockwise';
  activeEffects: string[];
}

const GameStatus = ({
  lastAction,
  gameDirection,
  activeEffects
}: GameStatusProps) => {
  return (
    <motion.div 
      className="bg-black/30 backdrop-blur-md rounded-xl p-3 mt-4 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-white mb-1 text-sm">
        {lastAction}
      </div>
      
      <div className="flex items-center justify-center space-x-3">
        <div className="text-xs text-white/70">
          {gameDirection === 'clockwise' ? '⟳ Clockwise' : '⟲ Counter-Clockwise'}
        </div>
        
        {activeEffects.includes('reverse') && (
          <motion.div 
            className="text-xs bg-white/20 rounded-full px-2 py-0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Reversed
          </motion.div>
        )}
        
        {activeEffects.includes('skip') && (
          <motion.div 
            className="text-xs bg-white/20 rounded-full px-2 py-0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Skipped
          </motion.div>
        )}
        
        {activeEffects.includes('draw2') && (
          <motion.div 
            className="text-xs bg-white/20 rounded-full px-2 py-0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Draw 2
          </motion.div>
        )}
        
        {activeEffects.includes('wild4') && (
          <motion.div 
            className="text-xs bg-white/20 rounded-full px-2 py-0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            Draw 4
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GameStatus;
