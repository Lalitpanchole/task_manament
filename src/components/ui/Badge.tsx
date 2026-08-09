import React from 'react';
import { cn } from '../../lib/utils';
import { TaskPriority } from '../../types/task';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'label' | 'outline';
  priority?: TaskPriority;
  className?: string;
  onClick?: () => void;
}

export const PriorityBadge: React.FC<{ priority: TaskPriority; className?: string }> = ({ priority, className }) => {
  let styleClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let iconBars = 1;

  switch (priority) {
    case 'Urgent':
      styleClasses = 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800';
      iconBars = 4;
      break;
    case 'High':
      styleClasses = 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      iconBars = 3;
      break;
    case 'Medium':
      styleClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      iconBars = 2;
      break;
    case 'Low':
      styleClasses = 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400';
      iconBars = 1;
      break;
    case 'No Priority':
      styleClasses = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
      iconBars = 0;
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium transition-colors',
        styleClasses,
        className
      )}
    >
      {/* Priority signal bars icon */}
      <span className="inline-flex items-end gap-0.5 h-3">
        <span className={cn('w-0.5 rounded-full', iconBars >= 1 ? 'h-1.5 bg-current' : 'h-1.5 bg-slate-300 dark:bg-slate-600')} />
        <span className={cn('w-0.5 rounded-full', iconBars >= 2 ? 'h-2 bg-current' : 'h-2 bg-slate-300 dark:bg-slate-600')} />
        <span className={cn('w-0.5 rounded-full', iconBars >= 3 ? 'h-2.5 bg-current' : 'h-2.5 bg-slate-300 dark:bg-slate-600')} />
        <span className={cn('w-0.5 rounded-full', iconBars >= 4 ? 'h-3 bg-current' : 'h-3 bg-slate-300 dark:bg-slate-600')} />
      </span>
      <span>{priority}</span>
    </span>
  );
};

export const LabelBadge: React.FC<{ label: string; className?: string; onRemove?: () => void }> = ({ label, className, onRemove }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ×
        </button>
      )}
    </span>
  );
};
