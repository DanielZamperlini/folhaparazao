import React from 'react';
import { DayData } from '../types';

interface SummaryProps {
  monthData: Record<string, DayData>;
}

export function Summary({ monthData }: SummaryProps) {
  const calculateTotalReturn = () => {
    return Object.values(monthData).reduce((total, data) => {
      const remaining = data.games.reduce(
        (sum, game) => sum + (game.remaining || 0),
        0,
      );
      return total + remaining - data.advance - data.bossGames;
    }, 0);
  };

  const totalReturn = calculateTotalReturn();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Retorno Total</h2>
      <p className="text-2xl font-bold text-emerald-600">
        R$ {totalReturn.toFixed(2)}
      </p>
      <p className="text-sm text-gray-500">
        (Soma de todos os retornos - adiantamentos - jogos do chefe)
      </p>
    </div>
  );
}
