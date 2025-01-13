import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { DayModal } from './components/DayModal';
import { Summary } from './components/Summary';
import { DayData, MonthData } from './types';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthData, setMonthData] = useState<MonthData>({});

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Controle de Jogos
        </h1>

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

export default App;
