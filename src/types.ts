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
  receivedValue: number;
  totalEarnings: number;
  balance: number;
}

export interface MonthData {
  [date: string]: DayData;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseCurrencyInput(value: string): number {
  // Remove todos os caracteres não numéricos, exceto ponto e vírgula
  const cleanValue = value.replace(/[^\d.,]/g, '');

  // Se não houver valor, retorna 0
  if (!cleanValue) return 0;

  // Converte vírgula para ponto e remove pontos de milhar
  const normalizedValue = cleanValue.replace(/\./g, '').replace(',', '.');

  // Converte para número
  return Number(normalizedValue);
}
