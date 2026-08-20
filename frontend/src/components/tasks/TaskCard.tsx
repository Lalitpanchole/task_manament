'use client';

import React from 'react';
import { Task } from '../../types/task';
import { PriorityBadge, LabelBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../lib/utils';
import { useTask } from '../../context/TaskContext';
import { Calendar, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onOpenDetails: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onOpenDetails }) => {
  const { fieldPreferences, members, setTaskStatus } = useTask();

  const assignedMembers = members.filter((m) => task.memberIds.includes(m.id));

  return (
    <div
      onClick={onOpenDetails}
      className="group relative bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer space-y-3"
    >
      {/* Top Header: Title & Quick Menu */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-slate-800 leading-snug">
          {task.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Quick status cycle or open details
            onOpenDetails();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Priority Badge */}
      {fieldPreferences.priority && (
        <div>
          <PriorityBadge priority={task.priority} />
        </div>
      )}

      {/* Label Badges */}
      {fieldPreferences.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map((lbl, idx) => (
            <LabelBadge key={`${lbl}-${idx}`} label={lbl} />
          ))}
        </div>
      )}

      {/* Bottom Footer: Member Avatars & Due Date */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
        {/* Members */}
        {fieldPreferences.members ? (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {assignedMembers.map((m) => (
              <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" />
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Due Date */}
        {fieldPreferences.dueDate && task.dueDate && (
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Column shift hover buttons */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1 pt-1">
        {task.status !== 'To Do' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTaskStatus(task.id, 'To Do');
            }}
            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            ← To Do
          </button>
        )}
        {task.status !== 'Doing' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTaskStatus(task.id, 'Doing');
            }}
            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            Doing
          </button>
        )}
        {task.status !== 'Completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTaskStatus(task.id, 'Completed');
            }}
            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            ✓ Done
          </button>
        )}
      </div>
    </div>
  );
};
