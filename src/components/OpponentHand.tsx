
import { motion } from 'framer-motion';
import { Card as CardType } from '@/types/game';

interface OpponentHandProps {
  playerName: string;
  cardCount: number;
  isCurrentPlayer: boolean;
  position: 'left' | 'top' | 'right';
  hasCalledUno: boolean;
}

const OpponentHand = ({
  playerName,
  cardCount,
  isCurrentPlayer,
  position,
  hasCalledUno
}: OpponentHandProps) => {
  // Calculate card positioning based on opponent position
  const getContainerStyle = () => {
    switch (position) {
      case 'left':
        return "absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center";
      case 'top':
        return "absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center";
      case 'right':
        return "absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center";
      default:
        return "";
    }
  };
  
  // Calculate the ideal card overlap based on number of cards
  const getCardOverlap = (total: number) => {
    if (total <= 3) return 0;
    if (total <= 6) return -20;
    if (total <= 10) return -30;
    return -35; // Maximum overlap for many cards
  };
  
  const getCardsContainerStyle = () => {
    const overlap = getCardOverlap(cardCount);
    
    switch (position) {
      case 'left':
        return `flex flex-col items-center justify-center -rotate-90 ${cardCount > 7 ? 'max-h-[60vh]' : ''}`;
      case 'top':
        return `flex flex-row items-center justify-center rotate-180 ${cardCount > 7 ? 'max-w-[80vw]' : ''}`;
      case 'right':
        return `flex flex-col items-center justify-center rotate-90 ${cardCount > 7 ? 'max-h-[60vh]' : ''}`;
      default:
        return "";
    }
  };
  
  // Scale down for smaller display
  const scaleFactor = position === 'top' ? 0.7 : 0.7;
  
  return (
    <div className={getContainerStyle()}>
      <div className={`${isCurrentPlayer ? "text-white font-bold" : "text-white/70"} mb-2 p-1 px-3 rounded-full ${isCurrentPlayer ? "bg-white/20 backdrop-blur-md animate-pulse" : ""}`}>
        {playerName} {hasCalledUno && cardCount === 1 && <span className="text-red-500 font-bold">UNO!</span>}
      </div>
      
      <div className={getCardsContainerStyle()}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <motion.div
            key={index}
            className="uno-card uno-card-back"
            style={{
              transform: `scale(${scaleFactor})`,
              marginLeft: position === 'top' ? (index === 0 ? 0 : getCardOverlap(cardCount)) : 0,
              marginTop: position !== 'top' ? (index === 0 ? 0 : getCardOverlap(cardCount)) : 0,
              zIndex: index
            }}
            initial={false}
            animate={isCurrentPlayer ? { y: [0, -5, 0], scale: [scaleFactor, scaleFactor * 1.02, scaleFactor], transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' } } : {}}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-2xl font-bold text-white transform -rotate-45 bg-white/10 px-3 py-1 rounded-lg">
                UNO
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OpponentHand;
