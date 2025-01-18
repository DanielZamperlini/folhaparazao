import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { DayModal } from './components/DayModal';
import { Summary } from './components/Summary';
import { Clover, PiggyBank } from 'lucide-react';
import { DayData, MonthData } from './types';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthData, setMonthData] = useState<MonthData>({});
  const [showProfits, setShowProfits] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('calendarData');
    if (savedData) {
      setMonthData(JSON.parse(savedData));
    }
  }, []);

  const handleDateSelect = (date: Date, openModal: boolean) => {
    setSelectedDate(date);
    if (openModal) {
      setIsModalOpen(true);
    }
  };

  const handleSaveDay = (dayData: DayData) => {
    const newMonthData = {
      ...monthData,
      [dayData.date]: dayData,
    };
    setMonthData(newMonthData);
    localStorage.setItem('calendarData', JSON.stringify(newMonthData));
  };

  const selectedDateKey = selectedDate.toISOString().split('T')[0];

  if (showProfits) {
    return (
      <div className="min-h-screen bg-green-950 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Lucros Mensais
              <PiggyBank className="w-10 h-10 text-green-400" />
            </h1>
            <button
              onClick={() => setShowProfits(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              Voltar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(getMonthlyData(monthData))
              .sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-');
                const [yearB, monthB] = b.split('-');
                if (yearA !== yearB) {
                  return parseInt(yearA) - parseInt(yearB);
                }
                return parseInt(monthA) - parseInt(monthB);
              })
              .map(([monthKey, total]) => (
                <div key={monthKey} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-medium text-gray-600 mb-2">
                    {formatMonthName(monthKey)}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    R$ {total.toFixed(2)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-1xl font-bold text-white flex items-center gap-2">
            Controle de Jogos
            <Clover className="w-8 h-8 text-green-600" />
          </h1>
          <button
            onClick={() => setShowProfits(true)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            Lucros Mensais
          </button>
        </div>

        <Summary monthData={monthData} />

        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          monthData={monthData}
        />

        <DayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          data={monthData[selectedDateKey]}
          onSave={handleSaveDay}
        />
      </div>
    </div>
  );
}

function getMonthlyData(monthData: MonthData) {
  const monthlyTotals: { [key: string]: number } = {};

  Object.entries(monthData).forEach(([date, data]) => {
    const [year, month] = date.split('-');
    const monthKey = `${year}-${month}`;
    monthlyTotals[monthKey] =
      (monthlyTotals[monthKey] || 0) + data.totalEarnings;
  });

  return monthlyTotals;
}

function formatMonthName(monthKey: string) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

export default App;
