import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DayData, GameEntry } from '../types';

const GAME_NAMES = [
  'PPT',
  'CANTA GALO',
  'PT',
  'PTV',
  'CORUJINHA/FEDERAL',
  'CORUJÃO',
];

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  data: DayData | null;
  onSave: (data: DayData) => void;
}

export function DayModal({
  isOpen,
  onClose,
  date,
  data,
  onSave,
}: DayModalProps) {
  const [games, setGames] = useState<GameEntry[]>(
    data?.games ||
      GAME_NAMES.map((name) => ({
        time: '',
        name,
        value: 0,
        profit: 0,
        prizeValue: 0,
        remaining: 0,
        hadPrize: false,
      })),
  );
  const [advance, setAdvance] = useState(data?.advance || 0);
  const [bossGames, setBossGames] = useState(data?.bossGames || 0);

  useEffect(() => {
    if (data) {
      setGames(data.games);
      setAdvance(data.advance);
      setBossGames(data.bossGames);
    } else {
      setGames(
        GAME_NAMES.map((name) => ({
          time: '',
          name,
          value: 0,
          profit: 0,
          prizeValue: 0,
          remaining: 0,
          hadPrize: false,
        })),
      );
      setAdvance(0);
      setBossGames(0);
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGameChange = (
    index: number,
    field: keyof GameEntry,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => {
    const newGames = [...games];
    if (field === 'value') {
      const gameValue = Number(value);
      newGames[index] = {
        ...newGames[index],
        value: gameValue,
        profit: gameValue * 0.2,
        remaining: gameValue * 0.8 - (newGames[index].prizeValue || 0),
      };
    } else if (field === 'prizeValue') {
      const prizeValue = Number(value);
      newGames[index] = {
        ...newGames[index],
        prizeValue,
        remaining: newGames[index].value * 0.8 - prizeValue,
        hadPrize: prizeValue > 0,
      };
    } else {
      newGames[index] = { ...newGames[index], [field]: value };
    }
    setGames(newGames);
  };

  const calculateFinalBalance = () => {
    const totalRemaining = games.reduce(
      (sum, game) => sum + (game.remaining || 0),
      0,
    );
    return totalRemaining - advance - bossGames;
  };

  const handleSave = () => {
    const totalEarnings = games.reduce(
      (sum, game) => sum + (game.profit || 0),
      0,
    );
    const balance = calculateFinalBalance();

    onSave({
      date: date.toISOString().split('T')[0],
      games,
      advance,
      bossGames,
      totalEarnings,
      balance,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {date.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 font-medium">
            <div>Jogo</div>
            <div>Valor</div>
            <div>Lucro (20%)</div>
            <div>Prêmio</div>
            <div>Retorno</div>
          </div>

          {games.map((game, index) => (
            <div key={index} className="grid grid-cols-5 gap-2">
              <div className="p-2 font-medium">{game.name}</div>
              <input
                type="number"
                value={game.value || ''}
                onChange={(e) =>
                  handleGameChange(index, 'value', e.target.value)
                }
                className="border rounded p-2"
                placeholder="Valor"
              />
              <div className="p-2 bg-gray-50 rounded">
                R$ {game.profit?.toFixed(2)}
              </div>
              <input
                type="number"
                value={game.prizeValue || ''}
                onChange={(e) =>
                  handleGameChange(index, 'prizeValue', e.target.value)
                }
                className="border rounded p-2"
                placeholder="Valor do Prêmio"
              />
              <div className="p-2 bg-gray-50 rounded">
                R$ {game.remaining?.toFixed(2)}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Adiantamento:</label>
              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(Number(e.target.value))}
                className="border rounded p-2"
                placeholder="Valor do adiantamento"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-medium">Jogos do Loro:</label>
              <input
                type="number"
                value={bossGames}
                onChange={(e) => setBossGames(Number(e.target.value))}
                className="border rounded p-2"
                placeholder="Valor dos jogos do Loro"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Total de Lucro:</span>
                <div className="text-lg">
                  R${' '}
                  {games
                    .reduce((sum, game) => sum + (game.profit || 0), 0)
                    .toFixed(2)}
                </div>
              </div>
              <div>
                <span className="font-medium">Saldo Final (Retorno):</span>
                <div className="text-lg">
                  R$ {calculateFinalBalance().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
