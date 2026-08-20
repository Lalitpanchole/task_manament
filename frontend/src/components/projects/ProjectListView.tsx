'use client';

import React, { useState } from 'react';
import useRouter from 'next/navigation';
import { useRouter as useNextRouter } from 'next/navigation';
import { useTask } from '../../context/TaskContext';
import { PriorityBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { ProjectFilterMenu } from './ProjectFilterMenu';
import { ProjectModal } from './ProjectModal';
import { formatDate } from '../../lib/utils';
import { Search, Plus, MoreHorizontal, Trash2, FolderKanban } from 'lucide-react';

export const ProjectListView: React.FC = () => {
  const { projects, members, projectFilters, deleteProject } = useTask();
  const router = useNextRouter();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = !projectFilters.priority || p.priority === projectFilters.priority;
    const matchesStatus = !projectFilters.status || p.status === projectFilters.status;
    const matchesLead = !projectFilters.memberId || p.leadId === projectFilters.memberId;
    return matchesSearch && matchesPriority && matchesStatus && matchesLead;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h1>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <ProjectFilterMenu />

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table (Screen 11) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <th className="py-3 px-4">Projects</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Lead</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {filteredProjects.map((project) => {
              const leadObj = members.find((m) => m.id === project.leadId);

              return (
                <tr
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <span>{project.name}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={project.priority} />
                  </td>

                  <td className="py-3.5 px-4">
                    {leadObj ? (
                      <div className="flex items-center gap-2">
                        <Avatar src={leadObj.avatar} name={leadObj.name} size="sm" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {leadObj.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    {formatDate(project.dueDate)}
                  </td>

                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === project.id ? null : project.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {openMenuId === project.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 top-10 z-30 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 text-left animate-in fade-in zoom-in-95"
                      >
                        <button
                          onClick={() => {
                            deleteProject(project.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                  No projects match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
