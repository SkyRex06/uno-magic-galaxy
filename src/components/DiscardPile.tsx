
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '@/types/game';
import CardComponent from './CardComponent';
import { Layers } from 'lucide-react';

interface DiscardPileProps {
  topCard: CardType | null;
  deckCount: number;
  onDeckClick: () => void;
  isPlayerTurn: boolean;
}

const DiscardPile = ({
  topCard,
  deckCount,
  onDeckClick,
  isPlayerTurn
}: DiscardPileProps) => {
  return (
    <div className="flex items-center justify-center space-x-16 my-8">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Deck visualization with card stacking effect */}
        <div className="relative">
          {/* Base cards for stack effect */}
          <div className="absolute top-0.5 left-0.5 uno-card uno-card-back opacity-20"></div>
          <div className="absolute top-1 left-1 uno-card uno-card-back opacity-30"></div>
          <div className="absolute top-1.5 left-1.5 uno-card uno-card-back opacity-40"></div>
          
          <motion.div
            className={`uno-card uno-card-back cursor-pointer ${isPlayerTurn ? 'hover:bg-gray-800' : ''}`}
            onClick={isPlayerTurn ? onDeckClick : undefined}
            whileHover={isPlayerTurn ? { scale: 1.05, y: -5 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-2xl font-bold text-white transform -rotate-45 bg-white/10 px-3 py-1 rounded-lg">
                UNO
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full flex items-center">
          <Layers size={14} className="mr-1" />
          {deckCount} cards
        </div>
        
        {isPlayerTurn && (
          <motion.div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-500/80 text-white text-xs px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Click to draw
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {topCard ? (
            <CardComponent 
              key={topCard.id} 
              card={topCard} 
              isTopCard={true} 
              showFront={true}
            />
          ) : (
            <div className="uno-card bg-black/20 border-white/10 flex items-center justify-center">
              <div className="text-sm text-white/50">Empty</div>
            </div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="absolute bottom-0 left-1/2 w-full h-12 rounded-full bg-gradient-to-t from-black/30 to-transparent"
          style={{ translateX: '-50%', translateY: '50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

export default DiscardPile;
