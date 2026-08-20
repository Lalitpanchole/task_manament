import React from 'react';
import { DedicatedTaskDetailsClient } from '../../../components/tasks/DedicatedTaskDetailsClient';

export function generateStaticParams() {
  return [
    { id: 'task-1' },
    { id: 'task-2' },
    { id: 'task-3' },
    { id: 'task-4' },
    { id: 'task-5' },
    { id: 'task-6' },
    { id: 'task-7' },
    { id: 'task-8' },
    { id: 'task-9' },
    { id: 'task-10' },
    { id: 'task-11' }
  ];
}

export default function DedicatedTaskDetailsPage() {
  return <DedicatedTaskDetailsClient />;
}
