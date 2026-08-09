'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ProjectListView } from '../../components/projects/ProjectListView';

export default function ProjectsPage() {
  return (
    <AppShell title="Projects">
      <ProjectListView />
    </AppShell>
  );
}
