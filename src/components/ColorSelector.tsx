
import { useState } from 'react';
import { CardColor } from '@/types/game';
import { motion } from 'framer-motion';

interface ColorSelectorProps {
  onColorSelected: (color: CardColor) => void;
}

const ColorSelector = ({ onColorSelected }: ColorSelectorProps) => {
  const [selectedColor, setSelectedColor] = useState<CardColor | null>(null);
  
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  const handleColorSelect = (color: CardColor) => {
    setSelectedColor(color);
    onColorSelected(color);
  };
  
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
    <motion.div 
      className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 w-80 z-50"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <h3 className="text-xl font-medium text-white mb-4 text-center">Select a color</h3>
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <motion.button
            key={color}
            className={`${getColorClass(color)} h-24 rounded-xl shadow-lg flex items-center justify-center text-white font-bold capitalize border-2 ${
              selectedColor === color ? 'border-white' : 'border-transparent'
            }`}
            onClick={() => handleColorSelect(color)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {color}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ColorSelector;
