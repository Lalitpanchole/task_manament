'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '../layout/AppShell';
import { useTask } from '../../context/TaskContext';
import { TaskBoardView } from './TaskBoardView';
import { TaskListView } from './TaskListView';

export function DedicatedTaskDetailsClient() {
  const params = useParams();
  const taskId = params?.id as string;
  const { setSelectedTaskId, taskView } = useTask();

  useEffect(() => {
    if (taskId) {
      setSelectedTaskId(taskId);
    }
  }, [taskId, setSelectedTaskId]);

  return (
    <AppShell title="Tasks">
      {taskView === 'board' ? <TaskBoardView /> : <TaskListView />}
    </AppShell>
  );
}
