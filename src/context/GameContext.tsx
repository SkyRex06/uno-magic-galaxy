import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Card, CardColor, Player } from '@/types/game';
import {
  initializeGame,
  canPlayCard,
  makeAIMove,
  getNextPlayerIndex,
  generateId,
  shuffleDeck
} from '@/utils/gameUtils';
import { toast } from '@/components/ui/use-toast';

// Define action types
type GameAction =
  | { type: 'START_GAME'; payload: { playerName: string; aiPlayerCount: number } }
  | { type: 'PLAY_CARD'; payload: { cardId: string; chosenColor?: CardColor } }
  | { type: 'DRAW_CARD' }
  | { type: 'CALL_UNO' }
  | { type: 'CATCH_UNO'; payload: { playerId: string } }
  | { type: 'AI_TURN' }
  | { type: 'RESET_GAME' };

// Define the context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playCard: (cardId: string, chosenColor?: CardColor) => void;
  drawCard: () => void;
  callUno: () => void;
  catchUno: (playerId: string) => void;
  startGame: (playerName: string, aiPlayerCount: number) => void;
  resetGame: () => void;
}

// Create context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Game reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const { playerName, aiPlayerCount } = action.payload;
      return initializeGame(playerName, aiPlayerCount);
    }
    
    case 'PLAY_CARD': {
      const { cardId, chosenColor } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];
      const cardIndex = currentPlayer.cards.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) {
        return state;
      }
      
      const card = currentPlayer.cards[cardIndex];
      const topCard = state.discardPile[state.discardPile.length - 1];
      
      // Check if the card can be played
      if (!canPlayCard(card, topCard, state.currentColor)) {
        return state;
      }
      
      // Remove the card from the player's hand
      const updatedPlayerCards = [...currentPlayer.cards];
      updatedPlayerCards.splice(cardIndex, 1);
      
      // Update player
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        cards: updatedPlayerCards
      };
      
      // Check if player has won
      if (updatedPlayerCards.length === 0) {
        return {
          ...state,
          players: updatedPlayers,
          discardPile: [...state.discardPile, card],
          gameStatus: 'finished',
          winner: currentPlayer,
          lastAction: `${currentPlayer.name} won the game!`,
          activeEffects: ['win']
        };
      }
      
      // Process the card effects
      let nextPlayerIndex = state.currentPlayerIndex;
      let direction = state.gameDirection;
      let lastAction = `${currentPlayer.name} played ${card.color} ${card.value}`;
      let activeEffects: string[] = [];
      let newColor = state.currentColor;
      
      // Apply card effects
      switch (card.type) {
        case 'reverse':
          direction = direction === 'clockwise' ? 'counter-clockwise' : 'clockwise';
          activeEffects.push('reverse');
          lastAction = `${currentPlayer.name} reversed the direction`;
          break;
          
        case 'skip':
          nextPlayerIndex = getNextPlayerIndex(
            state.currentPlayerIndex,
            state.players.length,
            direction,
            true
          );
          activeEffects.push('skip');
          lastAction = `${currentPlayer.name} skipped the next player`;
          break;
          
        case 'draw2':
          // Next player draws 2 cards
          const nextPlayer = state.players[getNextPlayerIndex(
            state.currentPlayerIndex,
            state.players.length,
            direction
          )];
          
          // Add 2 cards from the deck to the next player
          if (state.deck.length >= 2) {
            const cardsToDraw = state.deck.slice(-2);
            const remainingDeck = state.deck.slice(0, -2);
            
            const nextPlayerIndex = updatedPlayers.findIndex(p => p.id === nextPlayer.id);
            updatedPlayers[nextPlayerIndex] = {
              ...nextPlayer,
              cards: [...nextPlayer.cards, ...cardsToDraw]
            };
            
            lastAction = `${currentPlayer.name} made ${nextPlayer.name} draw 2 cards`;
            activeEffects.push('draw2');
            
            // Skip the next player
            nextPlayerIndex = getNextPlayerIndex(
              state.currentPlayerIndex,
              state.players.length,
              direction,
              true
            );
            
            return {
              ...state,
              players: updatedPlayers,
              deck: remainingDeck,
              discardPile: [...state.discardPile, card],
              currentPlayerIndex: nextPlayerIndex,
              gameDirection: direction,
              currentColor: card.color,
              lastAction,
              activeEffects
            };
          }
          break;
          
        case 'wild':
          newColor = chosenColor || 'red';
          activeEffects.push('wild');
          lastAction = `${currentPlayer.name} changed the color to ${newColor}`;
          break;
          
        case 'wild4':
          newColor = chosenColor || 'red';
          
          // Next player draws 4 cards
          const wildNextPlayer = state.players[getNextPlayerIndex(
            state.currentPlayerIndex,
            state.players.length,
            direction
          )];
          
          // Add 4 cards from the deck to the next player
          if (state.deck.length >= 4) {
            const cardsToDraw = state.deck.slice(-4);
            const remainingDeck = state.deck.slice(0, -4);
            
            const nextPlayerIndex = updatedPlayers.findIndex(p => p.id === wildNextPlayer.id);
            updatedPlayers[nextPlayerIndex] = {
              ...wildNextPlayer,
              cards: [...wildNextPlayer.cards, ...cardsToDraw]
            };
            
            lastAction = `${currentPlayer.name} changed the color to ${newColor} and made ${wildNextPlayer.name} draw 4 cards`;
            activeEffects.push('wild4');
            
            // Skip the next player
            nextPlayerIndex = getNextPlayerIndex(
              state.currentPlayerIndex,
              state.players.length,
              direction,
              true
            );
            
            return {
              ...state,
              players: updatedPlayers,
              deck: remainingDeck,
              discardPile: [...state.discardPile, card],
              currentPlayerIndex: nextPlayerIndex,
              gameDirection: direction,
              currentColor: newColor,
              lastAction,
              activeEffects
            };
          }
          break;
      }
      
      // Get the next player
      nextPlayerIndex = getNextPlayerIndex(
        state.currentPlayerIndex,
        state.players.length,
        direction
      );
      
      // Reset UNO call status when player plays a card
      if (updatedPlayerCards.length > 1) {
        updatedPlayers[state.currentPlayerIndex] = {
          ...updatedPlayers[state.currentPlayerIndex],
          hasCalledUno: false
        };
      }
      
      return {
        ...state,
        players: updatedPlayers,
        discardPile: [...state.discardPile, card],
        currentPlayerIndex: nextPlayerIndex,
        gameDirection: direction,
        currentColor: card.type === 'wild' || card.type === 'wild4' ? newColor : card.color,
        lastAction,
        activeEffects
      };
    }
    
    case 'DRAW_CARD': {
      // Player draws a card from the deck
      if (state.deck.length === 0) {
        // Reshuffle discard pile except for the top card
        const topCard = state.discardPile[state.discardPile.length - 1];
        const cardsToReshuffle = state.discardPile.slice(0, -1);
        const newDeck = shuffleDeck(cardsToReshuffle);
        
        return {
          ...state,
          deck: newDeck,
          discardPile: [topCard],
          lastAction: 'Deck was reshuffled',
          activeEffects: ['shuffle']
        };
      }
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const drawnCard = state.deck[state.deck.length - 1];
      const remainingDeck = state.deck.slice(0, -1);
      
      // Add the drawn card to the player's hand
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        cards: [...currentPlayer.cards, drawnCard],
        hasCalledUno: false // Reset UNO call when drawing
      };
      
      // Check if the drawn card can be played
      const topCard = state.discardPile[state.discardPile.length - 1];
      const canPlay = canPlayCard(drawnCard, topCard, state.currentColor);
      
      // If the card can't be played, move to the next player
      if (!canPlay) {
        const nextPlayerIndex = getNextPlayerIndex(
          state.currentPlayerIndex,
          state.players.length,
          state.gameDirection
        );
        
        return {
          ...state,
          players: updatedPlayers,
          deck: remainingDeck,
          currentPlayerIndex: nextPlayerIndex,
          lastAction: `${currentPlayer.name} drew a card`,
          activeEffects: []
        };
      }
      
      // If the card can be played, keep the same player (they can choose to play or keep)
      return {
        ...state,
        players: updatedPlayers,
        deck: remainingDeck,
        lastAction: `${currentPlayer.name} drew a card that can be played`,
        activeEffects: []
      };
    }
    
    case 'CALL_UNO': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Player must have exactly one card to call UNO
      if (currentPlayer.cards.length !== 1) {
        return state;
      }
      
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        hasCalledUno: true
      };
      
      return {
        ...state,
        players: updatedPlayers,
        lastAction: `${currentPlayer.name} called UNO!`,
        activeEffects: ['uno']
      };
    }
    
    case 'CATCH_UNO': {
      const { playerId } = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) {
        return state;
      }
      
      const player = state.players[playerIndex];
      
      // Check if the player has one card and hasn't called UNO
      if (player.cards.length === 1 && !player.hasCalledUno) {
        // Draw 2 penalty cards
        if (state.deck.length >= 2) {
          const cardsToDraw = state.deck.slice(-2);
          const remainingDeck = state.deck.slice(0, -2);
          
          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex] = {
            ...player,
            cards: [...player.cards, ...cardsToDraw]
          };
          
          return {
            ...state,
            players: updatedPlayers,
            deck: remainingDeck,
            lastAction: `${player.name} was caught not saying UNO and drew 2 cards`,
            activeEffects: ['caught']
          };
        }
      }
      
      return state;
    }
    
    case 'AI_TURN': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Skip if not an AI player or game is finished
      if (!currentPlayer.isAI || state.gameStatus !== 'playing') {
        return state;
      }
      
      const { cardPlayed, chosenColor } = makeAIMove(state);
      
      // If AI has a playable card
      if (cardPlayed) {
        // Call UNO if playing second-to-last card
        if (currentPlayer.cards.length === 2) {
          // AI has 50% chance to forget to call UNO
          const willCallUno = Math.random() > 0.5;
          
          if (willCallUno) {
            const updatedPlayers = [...state.players];
            updatedPlayers[state.currentPlayerIndex] = {
              ...currentPlayer,
              hasCalledUno: true
            };
            
            return {
              ...state,
              players: updatedPlayers,
              lastAction: `${currentPlayer.name} called UNO!`,
              activeEffects: ['uno']
            };
          }
        }
        
        // Play the chosen card
        return gameReducer(state, {
          type: 'PLAY_CARD',
          payload: { cardId: cardPlayed.id, chosenColor: chosenColor || undefined }
        });
      } else {
        // Draw a card
        return gameReducer(state, { type: 'DRAW_CARD' });
      }
    }
    
    case 'RESET_GAME':
      return {
        players: [],
        currentPlayerIndex: 0,
        deck: [],
        discardPile: [],
        currentColor: 'red',
        gameDirection: 'clockwise',
        gameStatus: 'waiting',
        winner: null,
        lastAction: '',
        activeEffects: []
      };
      
    default:
      return state;
  }
};

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const initialState: GameState = {
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    currentColor: 'red',
    gameDirection: 'clockwise',
    gameStatus: 'waiting',
    winner: null,
    lastAction: '',
    activeEffects: []
  };
  
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Helper functions
  const playCard = (cardId: string, chosenColor?: CardColor) => {
    dispatch({ type: 'PLAY_CARD', payload: { cardId, chosenColor } });
  };
  
  const drawCard = () => {
    dispatch({ type: 'DRAW_CARD' });
  };
  
  const callUno = () => {
    dispatch({ type: 'CALL_UNO' });
  };
  
  const catchUno = (playerId: string) => {
    dispatch({ type: 'CATCH_UNO', payload: { playerId } });
  };
  
  const startGame = (playerName: string, aiPlayerCount: number) => {
    dispatch({
      type: 'START_GAME',
      payload: { playerName, aiPlayerCount }
    });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  // AI Turn effect
  useEffect(() => {
    if (
      state.gameStatus === 'playing' &&
      state.players.length > 0 &&
      state.players[state.currentPlayerIndex]?.isAI
    ) {
      // Add a delay to make AI turns feel more natural
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'AI_TURN' });
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.currentPlayerIndex, state.gameStatus]);
  
  // Effects for notifying about important game events
  useEffect(() => {
    if (state.activeEffects.includes('uno')) {
      toast({
        title: "UNO!",
        description: state.lastAction,
        variant: "default",
      });
    }
    
    if (state.activeEffects.includes('win')) {
      toast({
        title: "Game Over!",
        description: state.lastAction,
        variant: "default",
      });
    }
  }, [state.activeEffects, state.lastAction]);
  
  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        playCard,
        drawCard,
        callUno,
        catchUno,
        startGame,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
