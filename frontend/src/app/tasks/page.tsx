'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { TaskBoardView } from '../../components/tasks/TaskBoardView';
import { TaskListView } from '../../components/tasks/TaskListView';
import { useTask } from '../../context/TaskContext';

export default function TasksPage() {
  const { taskView } = useTask();

  return (
    <AppShell title="Tasks">
      {taskView === 'board' ? <TaskBoardView /> : <TaskListView />}
    </AppShell>
  );
}
