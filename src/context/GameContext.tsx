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
      
      if (!canPlayCard(card, topCard, state.currentColor)) {
        return state;
      }
      
      const updatedPlayerCards = [...currentPlayer.cards];
      updatedPlayerCards.splice(cardIndex, 1);
      
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        cards: updatedPlayerCards
      };
      
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
      
      let nextPlayerIndex = state.currentPlayerIndex;
      let direction = state.gameDirection;
      let lastAction = `${currentPlayer.name} played ${card.color} ${card.value}`;
      let activeEffects: string[] = [];
      let newColor = state.currentColor;
      
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
          const nextPlayer = state.players[getNextPlayerIndex(
            state.currentPlayerIndex,
            state.players.length,
            direction
          )];
          
          if (state.deck.length >= 2) {
            const cardsToDraw = state.deck.slice(-2);
            const remainingDeck = state.deck.slice(0, -2);
            
            const playerTargetIndex = updatedPlayers.findIndex(p => p.id === nextPlayer.id);
            updatedPlayers[playerTargetIndex] = {
              ...nextPlayer,
              cards: [...nextPlayer.cards, ...cardsToDraw]
            };
            
            lastAction = `${currentPlayer.name} made ${nextPlayer.name} draw 2 cards`;
            activeEffects.push('draw2');
            
            const skipToPlayerIndex = getNextPlayerIndex(
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
              currentPlayerIndex: skipToPlayerIndex,
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
          
          const wildNextPlayer = state.players[getNextPlayerIndex(
            state.currentPlayerIndex,
            state.players.length,
            direction
          )];
          
          if (state.deck.length >= 4) {
            const cardsToDraw = state.deck.slice(-4);
            const remainingDeck = state.deck.slice(0, -4);
            
            const wildTargetIndex = updatedPlayers.findIndex(p => p.id === wildNextPlayer.id);
            updatedPlayers[wildTargetIndex] = {
              ...wildNextPlayer,
              cards: [...wildNextPlayer.cards, ...cardsToDraw]
            };
            
            lastAction = `${currentPlayer.name} changed the color to ${newColor} and made ${wildNextPlayer.name} draw 4 cards`;
            activeEffects.push('wild4');
            
            const wildSkipIndex = getNextPlayerIndex(
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
              currentPlayerIndex: wildSkipIndex,
              gameDirection: direction,
              currentColor: newColor,
              lastAction,
              activeEffects
            };
          }
          break;
      }
      
      nextPlayerIndex = getNextPlayerIndex(
        state.currentPlayerIndex,
        state.players.length,
        direction
      );
      
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
      if (state.deck.length === 0) {
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
      
      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = {
        ...currentPlayer,
        cards: [...currentPlayer.cards, drawnCard],
        hasCalledUno: false
      };
      
      const topCard = state.discardPile[state.discardPile.length - 1];
      const canPlay = canPlayCard(drawnCard, topCard, state.currentColor);
      
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
      
      if (player.cards.length === 1 && !player.hasCalledUno) {
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
      
      if (!currentPlayer.isAI || state.gameStatus !== 'playing') {
        return state;
      }
      
      const { cardPlayed, chosenColor } = makeAIMove(state);
      
      if (cardPlayed) {
        if (currentPlayer.cards.length === 2) {
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
        
        return gameReducer(state, {
          type: 'PLAY_CARD',
          payload: { cardId: cardPlayed.id, chosenColor: chosenColor || undefined }
        });
      } else {
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
  
  useEffect(() => {
    if (
      state.gameStatus === 'playing' &&
      state.players.length > 0 &&
      state.players[state.currentPlayerIndex]?.isAI
    ) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'AI_TURN' });
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.currentPlayerIndex, state.gameStatus]);
  
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

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
