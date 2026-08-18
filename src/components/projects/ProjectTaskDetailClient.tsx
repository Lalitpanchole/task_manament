'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '../layout/AppShell';
import { useTask } from '../../context/TaskContext';
import { TaskBoardView } from '../tasks/TaskBoardView';
import { TaskListView } from '../tasks/TaskListView';

export function ProjectTaskDetailClient() {
  const params = useParams();
  const projectId = params?.id as string;
  const { projects, taskView } = useTask();

  const project = projects.find((p) => p.id === projectId);
  const projectName = project ? project.name : 'Project Details';

  return (
    <AppShell title={projectName} breadcrumb="Projects">
      {taskView === 'board' ? <TaskBoardView /> : <TaskListView />}
    </AppShell>
  );
}
