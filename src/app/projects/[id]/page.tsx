import React from 'react';
import { ProjectTaskDetailClient } from '../../../components/projects/ProjectTaskDetailClient';

export function generateStaticParams() {
  return [
    { id: 'proj-1' },
    { id: 'proj-2' },
    { id: 'proj-3' }
  ];
}

export default function ProjectTaskDetailPage() {
  return <ProjectTaskDetailClient />;
}
