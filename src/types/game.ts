
export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';
export type CardValue = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value: CardValue;
}

export type Player = {
  id: string;
  name: string;
  isAI: boolean;
  cards: Card[];
  hasCalledUno: boolean;
};

export type GameDirection = 'clockwise' | 'counter-clockwise';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  currentColor: CardColor;
  gameDirection: GameDirection;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: Player | null;
  lastAction: string;
  activeEffects: string[];
}
