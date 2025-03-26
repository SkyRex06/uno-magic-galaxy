
import { Card, CardColor, CardType, CardValue, GameState, Player } from "@/types/game";

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Create a new deck of UNO cards
export const createDeck = (): Card[] => {
  const colors: CardColor[] = ["red", "blue", "green", "yellow"];
  const numbers: CardValue[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const specialCards: [CardType, CardValue][] = [
    ["skip", "skip"],
    ["reverse", "reverse"],
    ["draw2", "draw2"]
  ];
  
  const deck: Card[] = [];
  
  // Add number cards (0-9) for each color
  colors.forEach(color => {
    // Only one '0' card per color
    deck.push({
      id: generateId(),
      color,
      type: "number",
      value: "0"
    });
    
    // Two of each number 1-9 per color
    numbers.slice(1).forEach(num => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: generateId(),
          color,
          type: "number",
          value: num
        });
      }
    });
    
    // Two special cards (Skip, Reverse, Draw Two) per color
    specialCards.forEach(([type, value]) => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: generateId(),
          color,
          type,
          value
        });
      }
    });
  });
  
  // Add Wild and Wild Draw Four cards
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: generateId(),
      color: "wild",
      type: "wild",
      value: "wild"
    });
    
    deck.push({
      id: generateId(),
      color: "wild",
      type: "wild4",
      value: "wild4"
    });
  }
  
  return shuffleDeck(deck);
};

// Shuffle the deck
export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// Deal cards to players
export const dealCards = (
  deck: Card[],
  players: Player[],
  cardsPerPlayer: number = 7
): { updatedDeck: Card[]; updatedPlayers: Player[] } => {
  const updatedDeck = [...deck];
  const updatedPlayers = [...players];
  
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < updatedPlayers.length; j++) {
      if (updatedDeck.length > 0) {
        const card = updatedDeck.pop()!;
        updatedPlayers[j].cards.push(card);
      }
    }
  }
  
  return { updatedDeck, updatedPlayers };
};

// Check if a card can be played on the current discard pile
export const canPlayCard = (
  card: Card,
  topCard: Card,
  currentColor: CardColor
): boolean => {
  // Wild cards can always be played
  if (card.color === "wild") {
    return true;
  }
  
  // Match color
  if (card.color === currentColor) {
    return true;
  }
  
  // Match value
  if (card.value === topCard.value) {
    return true;
  }
  
  return false;
};

// Make AI move
export const makeAIMove = (
  gameState: GameState
): { cardPlayed: Card | null; chosenColor: CardColor | null } => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  const currentColor = gameState.currentColor;
  
  // Find all playable cards
  const playableCards = currentPlayer.cards.filter(card => 
    canPlayCard(card, topCard, currentColor)
  );
  
  if (playableCards.length === 0) {
    // No playable cards, return null to draw a card
    return { cardPlayed: null, chosenColor: null };
  }
  
  // Sort playable cards by preference (prioritize special cards)
  playableCards.sort((a, b) => {
    // Priority: Wild Draw 4 > Wild > Draw 2 > Skip > Reverse > Number
    const getCardPriority = (card: Card): number => {
      if (card.type === "wild4") return 6;
      if (card.type === "wild") return 5;
      if (card.type === "draw2") return 4;
      if (card.type === "skip") return 3;
      if (card.type === "reverse") return 2;
      return 1;
    };
    
    return getCardPriority(b) - getCardPriority(a);
  });
  
  const chosenCard = playableCards[0];
  
  // Choose a color for wild cards
  let chosenColor: CardColor | null = null;
  if (chosenCard.color === "wild") {
    // Count cards by color to choose the most common
    const colorCounts: Record<CardColor, number> = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      wild: 0
    };
    
    currentPlayer.cards.forEach(card => {
      if (card.color !== "wild") {
        colorCounts[card.color]++;
      }
    });
    
    // Find the color with the most cards
    const colors: CardColor[] = ["red", "blue", "green", "yellow"];
    chosenColor = colors.reduce(
      (maxColor, color) => 
        colorCounts[color] > colorCounts[maxColor] ? color : maxColor,
      "red" as CardColor
    );
  }
  
  return { cardPlayed: chosenCard, chosenColor };
};

// Get the next player index based on game direction and special cards
export const getNextPlayerIndex = (
  currentIndex: number, 
  playerCount: number, 
  direction: 'clockwise' | 'counter-clockwise',
  skip: boolean = false
): number => {
  const increment = direction === 'clockwise' ? 1 : -1;
  let nextIndex = (currentIndex + increment + playerCount) % playerCount;
  
  if (skip) {
    nextIndex = (nextIndex + increment + playerCount) % playerCount;
  }
  
  return nextIndex;
};

// Initialize a new game state
export const initializeGame = (
  playerName: string,
  aiPlayerCount: number = 3
): GameState => {
  // Create players
  const players: Player[] = [
    {
      id: generateId(),
      name: playerName,
      isAI: false,
      cards: [],
      hasCalledUno: false
    }
  ];
  
  // Add AI players
  for (let i = 0; i < aiPlayerCount; i++) {
    players.push({
      id: generateId(),
      name: `AI Player ${i + 1}`,
      isAI: true,
      cards: [],
      hasCalledUno: false
    });
  }
  
  // Create and shuffle the deck
  const deck = createDeck();
  
  // Deal cards to players
  const { updatedDeck, updatedPlayers } = dealCards(deck, players);
  
  // Set up initial discard pile
  let initialCard = updatedDeck.pop()!;
  
  // Make sure the first card is not a wild card
  while (initialCard.color === "wild") {
    updatedDeck.unshift(initialCard);
    initialCard = updatedDeck.pop()!;
  }
  
  return {
    players: updatedPlayers,
    currentPlayerIndex: 0,
    deck: updatedDeck,
    discardPile: [initialCard],
    currentColor: initialCard.color,
    gameDirection: "clockwise",
    gameStatus: "playing",
    winner: null,
    lastAction: "Game started",
    activeEffects: []
  };
};
