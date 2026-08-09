'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '../../../components/layout/AppShell';
import { useTask } from '../../../context/TaskContext';
import { TaskBoardView } from '../../../components/tasks/TaskBoardView';
import { TaskListView } from '../../../components/tasks/TaskListView';

export default function DedicatedTaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
