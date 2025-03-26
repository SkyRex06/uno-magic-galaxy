
import { useState, useEffect } from 'react';
import { Card as CardType } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  isTopCard?: boolean;
  showFront?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const CardComponent = ({
  card,
  isPlayable = false,
  isTopCard = false,
  showFront = true,
  onClick,
  disabled = false,
  style
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Reset hover state when playability changes
    setIsHovered(false);
  }, [isPlayable]);
  
  const getColorClass = () => {
    if (!showFront) return "uno-card-back";
    
    switch (card.color) {
      case "red": return "uno-card-red";
      case "blue": return "uno-card-blue";
      case "green": return "uno-card-green";
      case "yellow": return "uno-card-yellow";
      case "wild": return "uno-card-wild";
      default: return "uno-card-back";
    }
  };
  
  const getCardSymbol = () => {
    switch (card.value) {
      case "skip": return "⊘";
      case "reverse": return "⟲";
      case "draw2": return "+2";
      case "wild": return "W";
      case "wild4": return "W+4";
      default: return card.value;
    }
  };
  
  // Special card decorations/symbols
  const renderCardDecorations = () => {
    if (card.value === "skip") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/70 relative">
            <div className="absolute inset-0 w-1 h-full bg-white/70 rotate-45 origin-center left-1/2 -ml-0.5"></div>
          </div>
        </div>
      );
    }
    
    if (card.value === "reverse") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-white/70 rounded-full border-t-transparent rotate-45"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-l-4 border-b-4 border-white/70 rotate-45 transform translate-x-1 translate-y-1"></div>
          </div>
        </div>
      );
    }
    
    if (card.value === "wild" || card.value === "wild4") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full relative">
            <div className="absolute inset-0 bg-uno-red rounded-full top-0 left-0 w-1/2 h-1/2"></div>
            <div className="absolute inset-0 bg-uno-blue rounded-full top-0 right-0 w-1/2 h-1/2"></div>
            <div className="absolute inset-0 bg-uno-yellow rounded-full bottom-0 left-0 w-1/2 h-1/2"></div>
            <div className="absolute inset-0 bg-uno-green rounded-full bottom-0 right-0 w-1/2 h-1/2"></div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <motion.div
      className={cn(
        "uno-card",
        getColorClass(),
        isPlayable && "cursor-pointer hover:shadow-2xl z-10",
        isHovered && "transform -translate-y-4 shadow-2xl",
        isTopCard && "shadow-lg"
      )}
      style={{
        ...style,
        zIndex: isHovered ? 20 : isTopCard ? 10 : 1
      }}
      onClick={!disabled && onClick ? onClick : undefined}
      onMouseEnter={() => isPlayable && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={isTopCard ? { scale: 1.1, opacity: 0 } : false}
      animate={
        isTopCard 
          ? { scale: 1, opacity: 1 } 
          : isHovered 
            ? { y: -16, scale: 1.05, zIndex: 20 } 
            : { y: 0, scale: 1, zIndex: 1 }
      }
      transition={{ duration: 0.2 }}
      whileTap={isPlayable ? { scale: 0.95 } : undefined}
    >
      {showFront ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {renderCardDecorations()}
          
          <div className="absolute top-2 left-2 font-bold text-white text-lg" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
            {getCardSymbol()}
          </div>
          
          <div className="absolute bottom-2 right-2 font-bold text-white text-lg transform rotate-180" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
            {getCardSymbol()}
          </div>
          
          {card.type === "number" && (
            <div className="text-4xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
              {card.value}
            </div>
          )}
          
          {(card.type === "draw2" || card.type === "wild4") && (
            <div className="text-4xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
              {card.type === "draw2" ? "+2" : "+4"}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-2xl font-bold text-white transform -rotate-45 bg-white/10 px-3 py-1 rounded-lg">
            UNO
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CardComponent;
