'use client';

import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { PriorityBadge, LabelBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { DatePickerPopover } from './DatePickerPopover';
import { formatDate } from '../../lib/utils';
import { TaskStatus, TaskPriority } from '../../types/task';
import {
  X,
  Plus,
  Send,
  Paperclip,
  Trash2,
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  CheckSquare,
  Square,
  Link as LinkIcon,
  ChevronRight,
} from 'lucide-react';

interface TaskDetailsModalProps {
  taskId: string | null;
  onClose: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ taskId, onClose }) => {
  const {
    tasks,
    members,
    setTaskStatus,
    setTaskPriority,
    setTaskDates,
    updateTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    addResource,
    toggleMemberOnTask,
    toggleLabelOnTask,
  } = useTask();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [isAddingResource, setIsAddingResource] = useState(false);

  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);

  const task = tasks.find((t) => t.id === taskId);

  if (!taskId || !task) return null;

  const handleSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle);
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(task.id, commentInput);
    setCommentInput('');
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceUrl.trim()) return;
    addResource(task.id, resourceTitle || resourceUrl, resourceUrl);
    setResourceTitle('');
    setResourceUrl('');
    setIsAddingResource(false);
  };

  const priorityOptions: TaskPriority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const statusOptions: TaskStatus[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Task Details</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <Lock className="w-4 h-4" />
            </button>
            <span className="flex items-center gap-1 text-xs">
              <Eye className="w-3.5 h-3.5" /> 1
            </span>
            <button className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Content Left & Details Right Panel */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
          {/* Main Left Content Area */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Title & Description Inline Edit */}
            <div>
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-slate-400 focus:outline-none py-1"
              />
              <textarea
                rows={2}
                value={task.description || ''}
                onChange={(e) => updateTask(task.id, { description: e.target.value })}
                placeholder="Add description..."
                className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-slate-400 focus:outline-none rounded-lg p-2 mt-1"
              />
            </div>

            {/* Properties row */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Properties</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  A Designer
                </span>
                {task.dueDate && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-medium">
                    📅 {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Labels row */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block">Labels</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {task.labels.map((lbl, idx) => (
                  <LabelBadge
                    key={`${lbl}-${idx}`}
                    label={lbl}
                    onRemove={() => toggleLabelOnTask(task.id, lbl)}
                  />
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Resources</span>
                <button
                  onClick={() => setIsAddingResource(!isAddingResource)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add document or link...</span>
                </button>
              </div>

              {isAddingResource && (
                <form onSubmit={handleResourceSubmit} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Title"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. https://...)"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                  <button type="submit" className="btn-primary px-3 py-1.5 rounded-lg font-medium">
                    Add
                  </button>
                </form>
              )}

              {task.resources.length > 0 && (
                <div className="space-y-1">
                  {task.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline p-1.5 rounded bg-slate-50 dark:bg-slate-800/50"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>{res.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Subtasks
                </span>
                <button
                  onClick={() => setIsAddingSubtask(!isAddingSubtask)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subtasks</span>
                </button>
              </div>

              {isAddingSubtask && (
                <form onSubmit={handleSubtaskSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Enter subtask title..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                  />
                  <button type="submit" className="btn-primary px-3 py-1.5 rounded-lg text-xs font-medium">
                    Save
                  </button>
                </form>
              )}

              {/* Subtask Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                      <th className="py-2 px-3">Task</th>
                      <th className="py-2 px-3">Priority</th>
                      <th className="py-2 px-3">Members</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {task.subtasks.map((sub) => {
                      const assignedMember = members.find((m) => m.id === sub.memberId);
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => toggleSubtask(task.id, sub.id)}
                              className="flex items-center gap-2 text-slate-800 dark:text-slate-200 hover:text-slate-900"
                            >
                              {sub.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                              <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                                {sub.title}
                              </span>
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <PriorityBadge priority={sub.priority} />
                          </td>
                          <td className="py-2.5 px-3">
                            {assignedMember ? (
                              <Avatar src={assignedMember.avatar} name={assignedMember.name} size="sm" />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {sub.dueDate ? formatDate(sub.dueDate) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => deleteSubtask(task.id, sub.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {task.subtasks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400 text-xs">
                          No subtasks added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comments Feed */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Comments
              </span>

              <div className="space-y-3">
                {task.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 text-xs">
                    <Avatar src={c.authorAvatar} name={c.authorName} size="md" />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {c.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="submit" className="btn-primary p-2 rounded-lg text-white">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Details Panel (Screen 6, 8) */}
          <div className="w-full lg:w-72 bg-slate-50/60 dark:bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-5 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Details</span>
              <button onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}>
                <Plus className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {/* Status Field */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Status</span>
              <select
                value={task.status}
                onChange={(e) => setTaskStatus(task.id, e.target.value as TaskStatus)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector Dropdown (Screen 6) */}
            <div className="space-y-1 relative">
              <span className="text-slate-400 font-medium block">Priority</span>
              <button
                type="button"
                onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
              >
                <PriorityBadge priority={task.priority} />
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {priorityDropdownOpen && (
                <div className="absolute left-0 top-14 z-30 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 space-y-0.5">
                  {priorityOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setTaskPriority(task.id, p);
                        setPriorityDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                    >
                      <PriorityBadge priority={p} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Members</span>
                <button
                  onClick={() => setMembersDropdownOpen(!membersDropdownOpen)}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Add members
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {task.memberIds.map((mId) => {
                  const memberObj = members.find((m) => m.id === mId);
                  return memberObj ? (
                    <Avatar key={mId} src={memberObj.avatar} name={memberObj.name} size="md" />
                  ) : null;
                })}
              </div>

              {membersDropdownOpen && (
                <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 mt-1">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => toggleMemberOnTask(task.id, m.id)}
                      className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar src={m.avatar} name={m.name} size="sm" />
                        <span>{m.name}</span>
                      </div>
                      {task.memberIds.includes(m.id) && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dates Calendar Selector (Screen 8) */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">Dates</span>
              <DatePickerPopover
                startDate={task.startDate}
                dueDate={task.dueDate}
                onSelectDate={(start, due) => setTaskDates(task.id, start, due)}
              />
            </div>

            {/* Teams & Reporter */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Teams</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Design Team</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Reporter</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Dexter</span>
              </div>
            </div>

            {/* Activity / Updates Audit Feed (Screen 6) */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                Updates
              </span>
              <div className="space-y-2 text-[11px] text-slate-500">
                {task.updates.map((u) => (
                  <div key={u.id} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{u.authorName}</span>{' '}
                    <span>{u.text}</span>
                    <span className="block text-[9px] text-slate-400 mt-0.5">{u.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
