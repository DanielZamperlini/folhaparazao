export interface GameEntry {
  time: string;
  name: string;
  value: number;
  profit: number;
  prizeValue: number;
  remaining: number;
  hadPrize: boolean;
}

export interface DayData {
  date: string;
  games: GameEntry[];
  advance: number;
  bossGames: number;
  totalEarnings: number;
  balance: number;
}

export interface MonthData {
  [date: string]: DayData;
}