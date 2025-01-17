import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayData } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date, openModal: boolean) => void;
  monthData: Record<string, DayData>;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  monthData,
}: CalendarProps) {
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const formatDateKey = (day: number) => {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day,
    );
    return date.toISOString().split('T')[0];
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + increment,
      1,
    );
    onDateSelect(newDate, false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          {selectedDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleMonthChange(-1);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleMonthChange(1);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="p-2"></div>
        ))}
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const hasData = monthData[dateKey];
          return (
            <button
              key={day}
              onClick={(e) => {
                e.preventDefault();
                const newDate = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  day,
                );
                onDateSelect(newDate, true);
              }}
              className={`p-2 rounded hover:bg-blue-50 relative ${
                hasData ? 'font-semibold text-blue-600' : ''
              }`}
            >
              {day}
              {hasData && (
                <span className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
