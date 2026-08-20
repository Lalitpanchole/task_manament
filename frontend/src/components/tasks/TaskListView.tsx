'use client';

import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { PriorityBadge, LabelBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { TaskModal } from './TaskModal';
import { formatDate } from '../../lib/utils';
import { TaskStatus, TaskPriority } from '../../types/task';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal, Trash2, Edit } from 'lucide-react';

export const TaskListView: React.FC = () => {
  const {
    tasks,
    searchQuery,
    fieldPreferences,
    members,
    setSelectedTaskId,
    setTaskStatus,
    setTaskPriority,
    deleteTask,
  } = useTask();

  const [activeModalStatus, setActiveModalStatus] = useState<TaskStatus | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const sections: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (st: string) => {
    setCollapsedSections((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  const priorityOptions: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

  return (
    <div className="space-y-6 pb-8">
      {sections.map((status) => {
        const sectionTasks = filteredTasks.filter((t) => t.status === status);
        const isCollapsed = collapsedSections[status];

        return (
          <div key={status} className="space-y-2">
            {/* Section Header */}
            <div className="flex items-center justify-between py-1 px-1">
              <button
                type="button"
                onClick={() => toggleSection(status)}
                className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-slate-900"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
                <span>{status}</span>
                <span className="text-[11px] font-normal text-slate-400">({sectionTasks.length})</span>
              </button>
            </div>

            {!isCollapsed && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                      <th className="py-2.5 px-4">Task</th>
                      {fieldPreferences.priority && <th className="py-2.5 px-4">Priority</th>}
                      {fieldPreferences.members && <th className="py-2.5 px-4">Members</th>}
                      {fieldPreferences.dueDate && <th className="py-2.5 px-4">Due Date</th>}
                      {fieldPreferences.labels && <th className="py-2.5 px-4">Labels</th>}
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {sectionTasks.map((task) => {
                      const assignedMembers = members.filter((m) => task.memberIds.includes(m.id));

                      return (
                        <tr
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                          {/* Task Name */}
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                            {task.title}
                          </td>

                          {/* Priority */}
                          {fieldPreferences.priority && (
                            <td className="py-3 px-4">
                              <PriorityBadge priority={task.priority} />
                            </td>
                          )}

                          {/* Members */}
                          {fieldPreferences.members && (
                            <td className="py-3 px-4">
                              <div className="flex items-center -space-x-1">
                                {assignedMembers.map((m) => (
                                  <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" />
                                ))}
                              </div>
                            </td>
                          )}

                          {/* Due Date */}
                          {fieldPreferences.dueDate && (
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              {task.dueDate ? formatDate(task.dueDate) : '—'}
                            </td>
                          )}

                          {/* Labels */}
                          {fieldPreferences.labels && (
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {task.labels.map((lbl, idx) => (
                                  <LabelBadge key={`${lbl}-${idx}`} label={lbl} />
                                ))}
                              </div>
                            </td>
                          )}

                          {/* Actions Column */}
                          <td className="py-3 px-4 text-right relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(openActionMenuId === task.id ? null : task.id);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Action Menu */}
                            {openActionMenuId === task.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-4 top-10 z-30 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 text-left space-y-1 animate-in fade-in zoom-in-95"
                              >
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setSelectedTaskId(task.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>View Details</span>
                                </button>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                                  <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 block uppercase">
                                    Change Priority
                                  </span>
                                  {priorityOptions.map((p) => (
                                    <button
                                      key={p}
                                      onClick={() => {
                                        setTaskPriority(task.id, p);
                                        setOpenActionMenuId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300"
                                    >
                                      {p}
                                    </button>
                                  ))}
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                                  <button
                                    onClick={() => {
                                      deleteTask(task.id);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Task</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Inline "+ Add Task" Section Row */}
                    <tr>
                      <td colSpan={6} className="py-2 px-4">
                        <button
                          type="button"
                          onClick={() => setActiveModalStatus(status)}
                          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {activeModalStatus && (
        <TaskModal
          isOpen={!!activeModalStatus}
          onClose={() => setActiveModalStatus(null)}
          initialStatus={activeModalStatus}
        />
      )}
    </div>
  );
};
