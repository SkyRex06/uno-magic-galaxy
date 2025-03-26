
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | null;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const GameOverModal = ({
  isOpen,
  winner,
  onPlayAgain,
  onMainMenu
}: GameOverModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <motion.div 
              className="text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
              
              {winner && (
                <div className="mb-6">
                  <p className="text-xl text-white/90 mb-4">
                    {winner.isAI ? (
                      <>
                        <span className="text-white/70">You lost to</span> {winner.name}
                      </>
                    ) : (
                      <>You won!</>
                    )}
                  </p>
                  
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <span className="text-4xl">🏆</span>
                  </motion.div>
                </div>
              )}
            </motion.div>
            
            <div className="flex flex-col space-y-3 mt-6">
              <motion.button
                className="btn-primary"
                onClick={onPlayAgain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Play Again
              </motion.button>
              
              <motion.button
                className="btn-secondary"
                onClick={onMainMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Main Menu
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;
