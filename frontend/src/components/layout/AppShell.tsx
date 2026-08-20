'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TaskDetailsModal } from '../tasks/TaskDetailsModal';
import { useTask } from '../../context/TaskContext';

interface AppShellProps {
  title?: string;
  breadcrumb?: string;
  onFilterClick?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  title = 'Tasks',
  breadcrumb,
  onFilterClick,
  children,
}) => {
  const { selectedTaskId, setSelectedTaskId } = useTask();

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pt-12 lg:pt-0">
        <Header title={title} breadcrumb={breadcrumb} onFilterClick={onFilterClick} />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>

      {/* Global Task Details Modal / Drawer */}
      {selectedTaskId && (
        <TaskDetailsModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};
