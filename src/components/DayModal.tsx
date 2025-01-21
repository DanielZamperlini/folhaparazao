import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import {
  DayData,
  GameEntry,
  formatCurrency,
  parseCurrencyInput,
} from '../types';

const GAME_NAMES = ['PPT', 'CT Galo', 'PT', 'PTV', '18h   FED', '22hrs'];

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
  const [receivedValue, setReceivedValue] = useState(data?.receivedValue || 0);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setGames(data.games);
      setAdvance(data.advance);
      setBossGames(data.bossGames);
      setReceivedValue(data.receivedValue || 0);
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
      setReceivedValue(0);
    }
  }, [data]);

  const handleGameChange = (
    index: number,
    field: keyof GameEntry,
    value: string,
    blur: boolean = false,
  ) => {
    const newGames = [...games];
    const numericValue = parseCurrencyInput(value);

    if (field === 'value') {
      newGames[index] = {
        ...newGames[index],
        value: numericValue,
        profit: numericValue * 0.2,
        remaining: numericValue * 0.8 - (newGames[index].prizeValue || 0),
      };
    } else if (field === 'prizeValue') {
      newGames[index] = {
        ...newGames[index],
        prizeValue: numericValue,
        remaining: newGames[index].value * 0.8 - numericValue,
        hadPrize: numericValue > 0,
      };
    }

    setGames(newGames);

    if (blur) {
      setInputValues((prev) => ({
        ...prev,
        [`${index}-${field}`]: formatCurrency(numericValue),
      }));
    } else {
      setInputValues((prev) => ({
        ...prev,
        [`${index}-${field}`]: value,
      }));
    }
  };

  const handleInputBlur = (
    type: 'advance' | 'bossGames' | 'receivedValue',
    value: string,
  ) => {
    const numericValue = parseCurrencyInput(value);
    switch (type) {
      case 'advance':
        setAdvance(numericValue);
        setInputValues((prev) => ({
          ...prev,
          advance: formatCurrency(numericValue),
        }));
        break;
      case 'bossGames':
        setBossGames(numericValue);
        setInputValues((prev) => ({
          ...prev,
          bossGames: formatCurrency(numericValue),
        }));
        break;
      case 'receivedValue':
        setReceivedValue(numericValue);
        setInputValues((prev) => ({
          ...prev,
          receivedValue: formatCurrency(numericValue),
        }));
        break;
    }
    setFocusedInput(null);
  };

  const handleInputFocus = (inputKey: string) => {
    setFocusedInput(inputKey);
    setInputValues((prev) => ({
      ...prev,
      [inputKey]: '',
    }));
  };

  const getInputValue = (inputKey: string, formattedValue: string) => {
    return focusedInput === inputKey
      ? inputValues[inputKey] || ''
      : formattedValue;
  };

  const calculateFinalBalance = () => {
    const totalRemaining = games.reduce(
      (sum, game) => sum + (game.remaining || 0),
      0,
    );
    return totalRemaining - advance - bossGames + receivedValue;
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
      receivedValue,
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
          <h2 className="text-2xl font-semibold">
            {date.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6 text-red-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 font-medium text-sm">
            <div>Jogo</div>
            <div>Valor</div>
            <div>Lucro (20%)</div>
            <div>Prêmio</div>
            <div>Retorno</div>
          </div>

          {games.map((game, index) => (
            <div key={index} className="grid grid-cols-5 gap-1 items-center">
              <div className="p-2 font-medium">{game.name}</div>
              <input
                type="text"
                value={getInputValue(
                  `${index}-value`,
                  game.value ? formatCurrency(game.value) : '',
                )}
                onChange={(e) =>
                  handleGameChange(index, 'value', e.target.value)
                }
                onFocus={() => handleInputFocus(`${index}-value`)}
                onBlur={(e) =>
                  handleGameChange(index, 'value', e.target.value, true)
                }
                className="border rounded p-2 text-xs"
                placeholder="Valor"
              />
              <div className="p-2 bg-gray-50 rounded text-xs">
                {formatCurrency(game.profit || 0)}
              </div>
              <input
                type="text"
                value={getInputValue(
                  `${index}-prizeValue`,
                  game.prizeValue ? formatCurrency(game.prizeValue) : '',
                )}
                onChange={(e) =>
                  handleGameChange(index, 'prizeValue', e.target.value)
                }
                onFocus={() => handleInputFocus(`${index}-prizeValue`)}
                onBlur={(e) =>
                  handleGameChange(index, 'prizeValue', e.target.value, true)
                }
                className="border rounded p-2 text-xs"
                placeholder="Prêmio"
              />
              <div className="p-2 bg-gray-50 rounded text-xs">
                {formatCurrency(game.remaining || 0)}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Adiantamento:</label>
              <input
                type="text"
                value={getInputValue(
                  'advance',
                  advance ? formatCurrency(advance) : '',
                )}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    advance: e.target.value,
                  }))
                }
                onFocus={() => handleInputFocus('advance')}
                onBlur={(e) => handleInputBlur('advance', e.target.value)}
                className="border rounded p-2"
                placeholder="Valor do adiantamento"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-medium">Jogos do Loro:</label>
              <input
                type="text"
                value={getInputValue(
                  'bossGames',
                  bossGames ? formatCurrency(bossGames) : '',
                )}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    bossGames: e.target.value,
                  }))
                }
                onFocus={() => handleInputFocus('bossGames')}
                onBlur={(e) => handleInputBlur('bossGames', e.target.value)}
                className="border rounded p-2"
                placeholder="Valor dos jogos do Loro"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-medium">Valor Recebido:</label>
              <input
                type="text"
                value={getInputValue(
                  'receivedValue',
                  receivedValue ? formatCurrency(receivedValue) : '',
                )}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    receivedValue: e.target.value,
                  }))
                }
                onFocus={() => handleInputFocus('receivedValue')}
                onBlur={(e) => handleInputBlur('receivedValue', e.target.value)}
                className="border rounded p-2"
                placeholder="Valor recebido"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Total de Lucro:</span>
                <div className="text-lg">
                  {formatCurrency(
                    games.reduce((sum, game) => sum + (game.profit || 0), 0),
                  )}
                </div>
              </div>
              <div>
                <span className="font-medium">Saldo Final (Retorno):</span>
                <div className="text-lg">
                  {formatCurrency(calculateFinalBalance())}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
