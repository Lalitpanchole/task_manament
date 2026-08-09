import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';

export const metadata: Metadata = {
  title: 'Pyramid Task Management | AbleSpace',
  description: 'Complete frontend task and project management system designed strictly from Figma specs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-slate-100 dark:selection:text-slate-900">
        <AuthProvider>
          <ThemeProvider>
            <TaskProvider>{children}</TaskProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
