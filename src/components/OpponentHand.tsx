
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
  
  const getCardsContainerStyle = () => {
    switch (position) {
      case 'left':
        return "flex flex-col items-center justify-center -rotate-90";
      case 'top':
        return "flex flex-row items-center justify-center rotate-180";
      case 'right':
        return "flex flex-col items-center justify-center rotate-90";
      default:
        return "";
    }
  };
  
  const getCardStyle = (index: number, total: number) => {
    // Scale down for smaller display
    const scaleFactor = position === 'top' ? 0.7 : 0.7;
    
    // Calculate overlap for cards
    const overlapFactor = Math.min(1, 7 / total); // Reduce overlap with more cards
    const offset = 15 * overlapFactor;
    
    return {
      transform: `scale(${scaleFactor})`,
      marginLeft: position === 'top' ? (index === 0 ? 0 : -70 * scaleFactor) : 0,
      marginTop: position !== 'top' ? (index === 0 ? 0 : -70 * scaleFactor) : 0,
    };
  };
  
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
            style={getCardStyle(index, cardCount)}
            initial={false}
            animate={isCurrentPlayer ? { y: [0, -5, 0], scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' } } : {}}
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
