'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface DatePickerPopoverProps {
  startDate?: string;
  dueDate?: string;
  onSelectDate: (startDate?: string, dueDate?: string) => void;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  startDate,
  dueDate,
  onSelectDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = Jan
  const [selectedStart, setSelectedStart] = useState<string | undefined>(startDate);
  const [selectedEnd, setSelectedEnd] = useState<string | undefined>(dueDate);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateStr);
      setSelectedEnd(undefined);
      onSelectDate(dateStr, undefined);
    } else {
      if (new Date(dateStr) < new Date(selectedStart)) {
        setSelectedStart(dateStr);
        setSelectedEnd(undefined);
        onSelectDate(dateStr, undefined);
      } else {
        setSelectedEnd(dateStr);
        onSelectDate(selectedStart, dateStr);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
        <span>{selectedEnd ? formatDate(selectedEnd) : selectedStart ? formatDate(selectedStart) : 'Select Date'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 text-xs animate-in fade-in zoom-in-95">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-medium text-slate-400 text-[11px] mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty Offset Days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-7" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const monthStr = String(currentMonth + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

              const isStart = selectedStart === dateStr;
              const isEnd = selectedEnd === dateStr;
              const isSelected = isStart || isEnd;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center font-medium text-xs transition-all relative ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {day}
                  {/* Decorative badge like Figma Screen 8 "Abhay" tag on selected day */}
                  {day === 10 && currentMonth === 0 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[8px] font-bold px-1 rounded shadow-2xs pointer-events-none">
                      Abhay
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
