
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card as CardType, CardColor } from '@/types/game';
import CardComponent from './CardComponent';
import ColorSelector from './ColorSelector';
import { canPlayCard } from '@/utils/gameUtils';

interface PlayerHandProps {
  cards: CardType[];
  isCurrentPlayer: boolean;
  playCard: (cardId: string, chosenColor?: CardColor) => void;
  topCard: CardType;
  currentColor: CardColor;
}

const PlayerHand = ({
  cards,
  isCurrentPlayer,
  playCard,
  topCard,
  currentColor
}: PlayerHandProps) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showColorSelector, setShowColorSelector] = useState(false);
  
  const handleCardClick = useCallback((card: CardType) => {
    if (!isCurrentPlayer) return;
    
    const isPlayable = canPlayCard(card, topCard, currentColor);
    if (!isPlayable) return;
    
    if (card.color === 'wild') {
      setSelectedCard(card);
      setShowColorSelector(true);
    } else {
      playCard(card.id);
    }
  }, [isCurrentPlayer, playCard, topCard, currentColor]);
  
  const handleColorSelected = useCallback((color: CardColor) => {
    if (selectedCard) {
      playCard(selectedCard.id, color);
      setSelectedCard(null);
      setShowColorSelector(false);
    }
  }, [selectedCard, playCard]);
  
  // Calculate optimal card display parameters based on number of cards
  const calculateCardDisplay = (totalCards: number) => {
    const isLargeHand = totalCards > 7;
    
    // Adjust overlap factor based on the number of cards
    let overlapFactor = 0;
    if (totalCards <= 5) {
      overlapFactor = 0; // No overlap for small hands
    } else if (totalCards <= 8) {
      overlapFactor = -30; // Slight overlap
    } else if (totalCards <= 12) {
      overlapFactor = -45; // Medium overlap
    } else {
      overlapFactor = -55; // Large overlap for many cards
    }
    
    return {
      isLargeHand,
      overlapFactor
    };
  };
  
  const { isLargeHand, overlapFactor } = calculateCardDisplay(cards.length);
  
  const isCardPlayable = useCallback((card: CardType) => {
    return isCurrentPlayer && canPlayCard(card, topCard, currentColor);
  }, [isCurrentPlayer, topCard, currentColor]);
  
  return (
    <div className="relative">
      <AnimatePresence>
        {showColorSelector && (
          <motion.div 
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ColorSelector onColorSelected={handleColorSelected} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative flex justify-center items-center mt-12">
        <div className={`flex justify-center ${isLargeHand ? 'overflow-x-auto max-w-[90vw] pb-4 px-4 scrollbar-none' : ''}`}>
          <div className="flex items-center">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className="relative"
                style={{ 
                  zIndex: isCardPlayable(card) ? 20 + index : 10 + index, 
                  marginLeft: index === 0 ? 0 : `${overlapFactor}px`
                }}
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <CardComponent
                  card={card}
                  isPlayable={isCardPlayable(card)}
                  showFront={true}
                  onClick={() => handleCardClick(card)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;
