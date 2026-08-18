'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { TaskBoardView } from '../components/tasks/TaskBoardView';
import { TaskListView } from '../components/tasks/TaskListView';
import { useTask } from '../context/TaskContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { taskView } = useTask();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <AppShell title="Tasks">
      {taskView === 'board' ? <TaskBoardView /> : <TaskListView />}
    </AppShell>
  );
}

