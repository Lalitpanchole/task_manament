'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Columns3, LayoutGrid, List } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { FieldPreferences } from '../../types/theme';

export const FieldsDropdown: React.FC = () => {
  const { taskView, setTaskView, fieldPreferences, setFieldPreferences } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleField = (key: keyof FieldPreferences) => {
    setFieldPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fieldsList: { key: keyof FieldPreferences; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
      >
        <Columns3 className="w-3.5 h-3.5 text-slate-500" />
        <span>Fields</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-40 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 text-xs animate-in fade-in zoom-in-95">
          {/* View Toggle Buttons Header */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2">
            <button
              type="button"
              onClick={() => setTaskView('list')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all ${
                taskView === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setTaskView('board')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md font-medium transition-all ${
                taskView === 'board'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* Fields Toggle Checkboxes */}
          <div className="space-y-0.5">
            {fieldsList.map((f) => (
              <label
                key={f.key}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <span>{f.label}</span>
                <input
                  type="checkbox"
                  checked={fieldPreferences[f.key]}
                  onChange={() => toggleField(f.key)}
                  className="rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
