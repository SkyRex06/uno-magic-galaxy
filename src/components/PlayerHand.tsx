
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
  
  // Calculate card positioning for hand effect
  const getCardStyle = (index: number, total: number) => {
    const maxSpread = Math.min(40, 360 / total); // Limit spread for many cards
    const rotation = maxSpread * (index - (total - 1) / 2) * 0.2;
    
    // Calculate horizontal position based on number of cards
    const spreadFactor = Math.min(1, 7 / total); // Reduce spread with more cards
    const xOffset = (index - (total - 1) / 2) * 30 * spreadFactor;
    
    // Calculate vertical position based on rotation
    const yOffset = Math.abs(rotation) * 0.3;
    
    return {
      transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
      marginLeft: index === 0 ? 0 : -60, // Overlap cards
    };
  };
  
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
      
      <div className="relative flex justify-center items-center min-h-36 mt-12">
        <div className="flex justify-center relative">
          {cards.map((card, index) => (
            <CardComponent
              key={card.id}
              card={card}
              isPlayable={isCardPlayable(card)}
              showFront={true}
              onClick={() => handleCardClick(card)}
              style={getCardStyle(index, cards.length)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;
