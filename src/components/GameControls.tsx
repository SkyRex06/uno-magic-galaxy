
import { motion } from 'framer-motion';
import { CardColor } from '@/types/game';

interface GameControlsProps {
  onDrawCard: () => void;
  onCallUno: () => void;
  canCallUno: boolean;
  isPlayerTurn: boolean;
  currentColor: CardColor;
}

const GameControls = ({
  onDrawCard,
  onCallUno,
  canCallUno,
  isPlayerTurn,
  currentColor
}: GameControlsProps) => {
  const getColorClass = (color: CardColor) => {
    switch (color) {
      case 'red': return 'bg-uno-red';
      case 'blue': return 'bg-uno-blue';
      case 'green': return 'bg-uno-green';
      case 'yellow': return 'bg-uno-yellow';
      default: return 'bg-gray-800';
    }
  };
  
  return (
    <div className="flex justify-center items-center space-x-6 mt-4">
      <motion.button
        className="btn-secondary px-6 py-3 rounded-xl flex items-center space-x-2"
        onClick={onDrawCard}
        disabled={!isPlayerTurn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span>Draw Card</span>
      </motion.button>
      
      <motion.div
        className={`${getColorClass(currentColor)} w-10 h-10 rounded-full shadow-lg`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      />
      
      <motion.button
        className={`${
          canCallUno 
            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" 
            : "bg-gray-600"
        } px-6 py-3 text-white font-bold rounded-xl shadow-lg`}
        onClick={onCallUno}
        disabled={!canCallUno}
        whileHover={canCallUno ? { scale: 1.05 } : {}}
        whileTap={canCallUno ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Call UNO!
      </motion.button>
    </div>
  );
};

export default GameControls;
