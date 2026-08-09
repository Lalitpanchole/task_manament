'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { FieldsDropdown } from '../tasks/FieldsDropdown';
import { TaskModal } from '../tasks/TaskModal';

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
  onFilterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Tasks', breadcrumb, onFilterClick }) => {
  const { searchQuery, setSearchQuery } = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Title / Breadcrumb */}
        <div className="flex items-center gap-2">
          {breadcrumb ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span>{breadcrumb}</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-semibold">{title}</span>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Real-time Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-200/50 dark:bg-slate-700/50">
              ⌘F
            </span>
          </div>

          {/* Fields Toggle Dropdown */}
          <FieldsDropdown />

          {/* Filter Button */}
          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title="Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}

          {/* Add Task Primary Action */}
          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </header>

      {/* Global Add Task Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
    </>
  );
};
