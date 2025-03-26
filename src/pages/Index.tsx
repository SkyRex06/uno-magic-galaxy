
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="game-bg min-h-screen flex flex-col justify-center items-center p-6">
      <motion.div
        className="max-w-4xl w-full glass-panel p-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-6xl font-bold text-gradient mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            type: "spring",
            stiffness: 100
          }}
        >
          UNO
        </motion.h1>
        
        <motion.p 
          className="text-white/70 text-lg max-w-md text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          The classic card game of matching colors and numbers. Be the first to play all your cards and win!
        </motion.p>
        
        <motion.div 
          className="flex flex-col space-y-4 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/game">
            <motion.button
              className="btn-primary w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Now
            </motion.button>
          </Link>
          
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Just for the demo, show instructions via modal or navigate to instructions page
              alert('UNO Rules: Match cards by color or number. First to play all cards wins.');
            }}
          >
            How to Play
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Card decorations for visual flair */}
      <motion.div
        className="absolute left-1/4 bottom-10 w-32 h-48 bg-uno-red rounded-xl shadow-lg transform -rotate-12 opacity-60"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        transition={{ 
          delay: 0.8,
          duration: 0.8,
          type: "spring" 
        }}
      />
      
      <motion.div
        className="absolute right-1/4 bottom-20 w-32 h-48 bg-uno-blue rounded-xl shadow-lg transform rotate-12 opacity-60"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        transition={{ 
          delay: 1,
          duration: 0.8, 
          type: "spring" 
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-1/3 w-24 h-36 bg-uno-green rounded-xl shadow-lg transform rotate-45 opacity-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.4 }}
        transition={{ 
          delay: 1.2,
          duration: 0.8, 
          type: "spring" 
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-1/4 w-24 h-36 bg-uno-yellow rounded-xl shadow-lg transform -rotate-30 opacity-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.4 }}
        transition={{ 
          delay: 1.4,
          duration: 0.8, 
          type: "spring" 
        }}
      />
    </div>
  );
};

export default Index;
