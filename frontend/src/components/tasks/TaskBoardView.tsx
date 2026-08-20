'use client';

import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { TaskStatus } from '../../types/task';
import { Plus } from 'lucide-react';

export const TaskBoardView: React.FC = () => {
  const { tasks, searchQuery, setSelectedTaskId } = useTask();
  const [activeModalStatus, setActiveModalStatus] = useState<TaskStatus | null>(null);

  const columns: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
        {columns.map((colStatus) => {
          const colTasks = filteredTasks.filter((t) => t.status === colStatus);

          return (
            <div
              key={colStatus}
              className="w-72 shrink-0 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[calc(100vh-140px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {colStatus}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalStatus(colStatus)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Scroll Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onOpenDetails={() => setSelectedTaskId(task.id)}
                  />
                ))}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 font-medium">No tasks</p>
                  </div>
                )}
              </div>

              {/* Column "+ Add Task" Footer Button */}
              <button
                onClick={() => setActiveModalStatus(colStatus)}
                className="mt-3 w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Inline Task Add Modal */}
      {activeModalStatus && (
        <TaskModal
          isOpen={!!activeModalStatus}
          onClose={() => setActiveModalStatus(null)}
          initialStatus={activeModalStatus}
        />
      )}
    </>
  );
};
