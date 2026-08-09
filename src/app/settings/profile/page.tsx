'use client';

import React from 'react';
import { AppShell } from '../../../components/layout/AppShell';
import { ProfileSettingsForm } from '../../../components/profile/ProfileSettingsForm';

export default function ProfileSettingsPage() {
  return (
    <AppShell title="Profile Settings">
      <ProfileSettingsForm />
    </AppShell>
  );
}
