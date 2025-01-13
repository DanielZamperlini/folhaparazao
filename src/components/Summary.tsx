import React from 'react';
import { DayData } from '../types';

interface SummaryProps {
  monthData: Record<string, DayData>;
}

export function Summary({ monthData }: SummaryProps) {
  const getMonthlyData = () => {
    const monthlyTotals: { [key: string]: number } = {};

    Object.entries(monthData).forEach(([date, data]) => {
      const [year, month] = date.split('-');
      const monthKey = `${year}-${month}`;
      monthlyTotals[monthKey] =
        (monthlyTotals[monthKey] || 0) + data.totalEarnings;
    });

    return monthlyTotals;
  };

  const calculateTotalReturn = () => {
    return Object.values(monthData).reduce((total, data) => {
      const remaining = data.games.reduce(
        (sum, game) => sum + (game.remaining || 0),
        0,
      );
      return total + remaining - data.advance - data.bossGames;
    }, 0);
  };

  const monthlyTotals = getMonthlyData();
  const totalReturn = calculateTotalReturn();

  const formatMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Lucro por Mês</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(monthlyTotals)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([monthKey, total]) => (
              <div key={monthKey} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-600">
                  {formatMonthName(monthKey)}
                </h3>
                <p className="text-xl font-bold text-indigo-600">
                  R$ {total.toFixed(2)}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Retorno Total</h2>
        <p className="text-2xl font-bold text-emerald-600">
          R$ {totalReturn.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          (Soma de todos os retornos - adiantamentos - jogos do Loro)
        </p>
      </div>
    </div>
  );
}
