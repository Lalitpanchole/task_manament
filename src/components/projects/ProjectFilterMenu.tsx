'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronRight, Check } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { TaskPriority } from '../../types/task';

export const ProjectFilterMenu: React.FC = () => {
  const { projectFilters, setProjectFilters, members } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const categories = [
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'teams', label: 'Teams' },
    { key: 'labels', label: 'Labels' },
    { key: 'reporter', label: 'Reporter' },
  ];

  const priorityOptions: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const statusOptions = ['Active', 'Completed', 'On Hold', 'Archived'];

  const handlePrioritySelect = (p: TaskPriority) => {
    setProjectFilters((prev) => ({
      ...prev,
      priority: prev.priority === p ? undefined : p,
    }));
  };

  const handleStatusSelect = (st: string) => {
    setProjectFilters((prev) => ({
      ...prev,
      status: prev.status === st ? undefined : st,
    }));
  };

  const handleMemberSelect = (mId: string) => {
    setProjectFilters((prev) => ({
      ...prev,
      memberId: prev.memberId === mId ? undefined : mId,
    }));
  };

  const activeCount = Object.values(projectFilters).filter(Boolean).length;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
      >
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[10px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 text-xs animate-in fade-in zoom-in-95">
          <div className="space-y-0.5 relative">
            {categories.map((cat) => (
              <div key={cat.key} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Submenu for Category */}
                {activeCategory === cat.key && (
                  <div className="absolute left-full top-0 ml-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 space-y-1">
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {cat.label}
                    </span>

                    {cat.key === 'priority' &&
                      priorityOptions.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePrioritySelect(p)}
                          className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                        >
                          <span>{p}</span>
                          {projectFilters.priority === p && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))}

                    {cat.key === 'status' &&
                      statusOptions.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusSelect(st)}
                          className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                        >
                          <span>{st}</span>
                          {projectFilters.status === st && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))}

                    {cat.key === 'members' &&
                      members.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleMemberSelect(m.id)}
                          className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                        >
                          <span>{m.name}</span>
                          {projectFilters.memberId === m.id && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))}

                    {['dueDate', 'teams', 'labels', 'reporter'].includes(cat.key) && (
                      <div className="p-2 text-slate-400 text-[11px] text-center">
                        All {cat.label}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeCount > 0 && (
            <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setProjectFilters({})}
                className="w-full text-center py-1 text-[11px] font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
