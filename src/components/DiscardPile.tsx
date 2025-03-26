
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '@/types/game';
import CardComponent from './CardComponent';

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
        <motion.div
          className="uno-card uno-card-back cursor-pointer"
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
        
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 text-white text-sm px-3 py-1 rounded-full">
          {deckCount} cards
        </div>
      </motion.div>
      
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="popLayout">
          {topCard && (
            <CardComponent 
              key={topCard.id} 
              card={topCard} 
              isTopCard={true} 
              showFront={true}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DiscardPile;
