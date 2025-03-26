
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import PlayerHand from './PlayerHand';
import OpponentHand from './OpponentHand';
import DiscardPile from './DiscardPile';
import GameControls from './GameControls';
import GameStatus from './GameStatus';

const GameBoard = () => {
  const { state, playCard, drawCard, callUno } = useGame();
  
  const getTopCard = () => {
    if (state.discardPile.length === 0) return null;
    return state.discardPile[state.discardPile.length - 1];
  };
  
  const isPlayerTurn = () => {
    if (state.gameStatus !== 'playing') return false;
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer && !currentPlayer.isAI;
  };
  
  const canCallUno = () => {
    if (!isPlayerTurn()) return false;
    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer && currentPlayer.cards.length === 1 && !currentPlayer.hasCalledUno;
  };
  
  const getHumanPlayer = () => {
    return state.players.find(player => !player.isAI);
  };
  
  const getOpponents = () => {
    return state.players.filter(player => player.isAI);
  };
  
  // Get opponents positioned around the table
  const getLeftOpponent = () => {
    const opponents = getOpponents();
    return opponents[0] || null;
  };
  
  const getTopOpponent = () => {
    const opponents = getOpponents();
    return opponents[1] || null;
  };
  
  const getRightOpponent = () => {
    const opponents = getOpponents();
    return opponents[2] || null;
  };
  
  return (
    <motion.div
      className="w-full h-full relative overflow-hidden flex flex-col items-center justify-between py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background particle effects for visual flair */}
      <div className="absolute inset-0 z-0">
        {state.activeEffects.includes('wild') && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="w-4 h-4 rounded-full bg-uno-red absolute"
              animate={{
                x: ['-100%', '200%'],
                y: ['-100%', '200%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                ease: 'easeOut'
              }}
              style={{ left: '40%', top: '30%' }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-uno-blue absolute"
              animate={{
                x: ['200%', '-100%'],
                y: ['-50%', '150%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.8,
                ease: 'easeOut',
                delay: 0.3
              }}
              style={{ left: '60%', top: '40%' }}
            />
            <motion.div
              className="w-5 h-5 rounded-full bg-uno-green absolute"
              animate={{
                x: ['-50%', '150%'],
                y: ['200%', '-100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2.2,
                ease: 'easeOut',
                delay: 0.1
              }}
              style={{ left: '30%', top: '60%' }}
            />
            <motion.div
              className="w-4 h-4 rounded-full bg-uno-yellow absolute"
              animate={{
                x: ['150%', '-50%'],
                y: ['150%', '-50%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.9,
                ease: 'easeOut',
                delay: 0.5
              }}
              style={{ left: '70%', top: '50%' }}
            />
          </div>
        )}
      </div>
      
      {/* Game board with opponents around the table */}
      <div className="flex-1 w-full relative">
        {/* Top opponent */}
        {getTopOpponent() && (
          <OpponentHand
            playerName={getTopOpponent()!.name}
            cardCount={getTopOpponent()!.cards.length}
            isCurrentPlayer={state.currentPlayerIndex === state.players.indexOf(getTopOpponent()!)}
            position="top"
            hasCalledUno={getTopOpponent()!.hasCalledUno}
          />
        )}
        
        {/* Left opponent */}
        {getLeftOpponent() && (
          <OpponentHand
            playerName={getLeftOpponent()!.name}
            cardCount={getLeftOpponent()!.cards.length}
            isCurrentPlayer={state.currentPlayerIndex === state.players.indexOf(getLeftOpponent()!)}
            position="left"
            hasCalledUno={getLeftOpponent()!.hasCalledUno}
          />
        )}
        
        {/* Right opponent */}
        {getRightOpponent() && (
          <OpponentHand
            playerName={getRightOpponent()!.name}
            cardCount={getRightOpponent()!.cards.length}
            isCurrentPlayer={state.currentPlayerIndex === state.players.indexOf(getRightOpponent()!)}
            position="right"
            hasCalledUno={getRightOpponent()!.hasCalledUno}
          />
        )}
        
        {/* Center discard pile and deck */}
        <DiscardPile
          topCard={getTopCard()}
          deckCount={state.deck.length}
          onDeckClick={drawCard}
          isPlayerTurn={isPlayerTurn()}
        />
        
        {/* Game status display */}
        <GameStatus
          lastAction={state.lastAction}
          gameDirection={state.gameDirection}
          activeEffects={state.activeEffects}
        />
      </div>
      
      {/* Player's hand at the bottom */}
      <div className="mt-auto">
        {getHumanPlayer() && (
          <>
            <PlayerHand
              cards={getHumanPlayer()!.cards}
              isCurrentPlayer={isPlayerTurn()}
              playCard={playCard}
              topCard={getTopCard()!}
              currentColor={state.currentColor}
            />
            
            <GameControls
              onDrawCard={drawCard}
              onCallUno={callUno}
              canCallUno={canCallUno()}
              isPlayerTurn={isPlayerTurn()}
              currentColor={state.currentColor}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GameBoard;
