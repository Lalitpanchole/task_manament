# AbleSpace Task Management System

A modern, responsive, and fully interactive Task Management System frontend developed for the **AbleSpace Technical Assessment**. Built strictly based on the provided 14 Figma screenshots, this application delivers a complete client-side workflow including guest authentication, Kanban board & grouped list views, real-time search, interactive task details, project management, dynamic field visibility, calendar date selection, theme switching, and accent color customization.

---

## 1. Project Overview

- **Figma Fidelity**: Designed and structured strictly following the 14 reference screens provided for the AbleSpace technical assessment.
- **Frontend Architecture**: Built using Next.js (App Router), TypeScript, and Tailwind CSS.
- **Interactive Workflow**: Features real-time state management for task CRUD, status shifts, priority updates, subtask lists, comments, and activity audit timeline logs.
- **Local Persistence**: All user preferences, auth sessions, task updates, project data, theme settings, and accent color modes persist in the browser using `localStorage`.
- **Frontend Only**: This phase focuses exclusively on the frontend application user experience. No backend API or database connection is included in this phase.

---

## 2. Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context (`AuthContext`, `TaskContext`, `ThemeContext`)
- **Storage**: Browser `localStorage`
- **Utilities**: `clsx`, `tailwind-merge`

---

## 3. Features

### Authentication & Guest Entry
- **Guest Login**: Instantly creates a frontend-only guest session and redirects to workspace tasks.
- **Simulated Google Login**: Simulates OAuth authentication flow and populates user session data.
- **Persistent Session**: Automatically retains logged-in session across page refreshes.

### Task Management
- **Kanban Board View**: Column-based layout (**To Do**, **Doing**, **Completed**, **On Hold**) with inline `+ Add Task` triggers.
- **Grouped List View**: Status-grouped task table with row actions menu (`...`) and group collapse toggles.
- **Task CRUD**: Create, edit inline, cycle status, change priority, and delete tasks.
- **Fields Visibility Menu**: Dynamic toggle menu to show/hide table columns (**Priority**, **Members**, **Due Date**, **Labels**, **Status**, **Reporter**).
- **Real-Time Search**: Live search input filtering task titles across both Board and List views with keyboard shortcut indicator (`⌘F`).

### Task Details Drawer & Calendar
- **Editable Content**: Title and description inline editing, property tags, and clickable resource attachments (`+ Add document or link...`).
- **Subtasks Table**: Add, edit priority/member, toggle completion with strikethrough styling, and delete subtasks.
- **Comments & Activity Stream**: Comment input feed with author avatars + automatically appended audit timeline log entries when status, priority, or due dates change.
- **Interactive Calendar Popover**: Interactive month grid (**January 2026**) supporting start/end date selection and day highlighting.

### Projects Management
- **Projects Table**: Displays project name, priority badge, lead avatar/name, due date, and actions menu.
- **Multi-Level Nested Filter Menu**: Filter categories (**Status**, **Priority** nested options, **Members**, **Due Date**, **Teams**, **Labels**, **Reporter**) that filter table rows live.
- **Project Task Context**: Route `/projects/[id]` with breadcrumb navigation (`Projects > Project Name`) displaying project-assigned tasks.

### Profile & Workspace Management
- **Profile Settings**: Edit profile picture URL, email, full name, title/role, and username.
- **Leave Workspace**: Workspace access section with destructive confirmation modal that clears session data and redirects to login.

### Theme & Customization Engine
- **Light & Dark Mode**: Seamless theme switching with persistent `.dark` root styling.
- **6 Accent Color Modes**: Palettes for **Amber**, **Blue**, **Pink**, **Rose**, **Emerald**, and **Black** applied dynamically to buttons, badges, active tabs, and focus rings.

### Local Persistence
The application persists the following in `localStorage`:
- User authentication session
- Task data and activity logs
- Project records
- Theme preference (Light / Dark)
- Accent color selection
- Field visibility preferences

---

## 4. Application Routes

| Route | Description |
| :--- | :--- |
| `/login` | Entry page with Pyramid branding, **Continue as Guest**, and **Login with Google** options. |
| `/tasks` | Main workspace dashboard featuring Kanban Board, List View, Search, and Fields controls. |
| `/tasks/[id]` | Dedicated Task Details page with task properties, subtasks, comments, calendar, and audit feed. |
| `/projects` | Projects list page with multi-level nested filter menu and project creation modal. |
| `/projects/[id]` | Project detail page displaying breadcrumb context (`Projects > Project Name`) and project tasks. |
| `/settings/profile` | Profile settings page to update user information and handle workspace logout. |

---

## 5. Project Structure

```
d:/My Projects/FigmaProject/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout wrapping Auth, Theme & Task Providers
│   │   ├── page.tsx                # Auth redirect guard
│   │   ├── globals.css             # CSS variables & accent color token setup
│   │   ├── login/page.tsx          # Guest & Google login screen
│   │   ├── tasks/page.tsx          # Board & List task views page
│   │   ├── tasks/[id]/page.tsx     # Dedicated task details page
│   │   ├── projects/page.tsx       # Projects table page
│   │   ├── projects/[id]/page.tsx  # Project task detail view
│   │   └── settings/profile/page.tsx # Profile settings page
│   ├── components/
│   │   ├── auth/                   # LoginForm component
│   │   ├── layout/                 # AppShell, Sidebar & Header components
│   │   ├── tasks/                  # TaskBoardView, TaskListView, TaskCard, TaskDetailsModal, TaskModal, FieldsDropdown, DatePickerPopover
│   │   ├── projects/               # ProjectListView, ProjectFilterMenu, ProjectModal
│   │   ├── profile/                # ProfileMenu & ProfileSettingsForm
│   │   ├── theme/                  # ThemeProvider & ColorMode setup
│   │   └── ui/                     # Avatar, Badge, Modal primitives
│   ├── context/
│   │   ├── AuthContext.tsx         # Guest & Google session state
│   │   ├── TaskContext.tsx         # Central state for Tasks, Projects, Fields & Filters
│   │   └── ThemeContext.tsx        # Light/Dark mode & 6 Accent colors state
│   ├── lib/
│   │   ├── initialData.ts          # Mock dataset matching Figma screenshots
│   │   ├── storage.ts              # LocalStorage helper functions
│   │   └── utils.ts                # Class merge (cn) and date formatting helpers
│   └── types/                      # TypeScript definitions (user, task, project, theme)
└── package.json
```

---

## 6. Getting Started

### Prerequisites
Make sure Node.js (v18+ recommended) is installed on your machine.

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Lalitpanchole/task_manament.git
   ```

2. Navigate into the project directory:
   ```bash
   cd FigmaProject
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 7. Production Build

To verify and create an optimized production build:

```bash
npm run build
```

To run the production server locally:

```bash
npm start
```

> **Build Verification**: The project build has been verified with `npm run build` and compiles cleanly with **0 TypeScript errors** and **0 build errors**.

---

## 8. Responsive Design

The application layout has been tested across major viewport breakpoints:

- **Desktop** (1440px+)
- **Tablet** (768px - 1024px)
- **Mobile** (375px - 430px)

### Responsive Features:
- Mobile drawer navigation triggered via hamburger menu
- Horizontal scrolling for Kanban board columns on mobile devices
- Stacking layout for Task Details side panel on narrow screens
- Responsive tables and dropdown popovers
- Zero accidental horizontal page overflow

---

## 9. Figma Design

This project is built directly from the provided **AbleSpace Technical Assessment** Figma design specification (`AbleSpace_Figma_Task_Management_Full_Flow.pdf`), matching all 14 reference screens for layout, spacing, typography, colors, borders, cards, tables, dropdowns, and theme controls.

Figma Reference: `<FIGMA_REFERENCE_URL>`

---

## 10. Frontend-Only Architecture

### Current Flow Architecture:
```
Next.js Frontend (App Router)
         ↓
  React Components
         ↓
React Context (Auth, Task, Theme)
         ↓
  Browser localStorage
```

### Current Status:
There is currently **NO**:
- NestJS backend service
- Database (MongoDB, PostgreSQL, or SQLite)
- Real OAuth provider
- REST / GraphQL endpoints

All actions operate using local state and persistent `localStorage`.

---

## 11. Testing & QA

Comprehensive runtime QA was conducted on the implemented frontend:

- ✅ Guest Login & Google simulated OAuth flow
- ✅ Kanban Board column rendering & card creation
- ✅ Grouped List View & dynamic column visibility toggling
- ✅ Task CRUD, status updates, priority shifts, and subtask management
- ✅ Comments feed and audit timeline log updates
- ✅ Date picker calendar popover
- ✅ Real-time title search filtering
- ✅ Multi-level nested filter menu on Projects
- ✅ Light / Dark theme switching and 6 accent color modes
- ✅ Profile settings update and Leave Workspace confirmation modal
- ✅ LocalStorage state persistence across refreshes
- ✅ Desktop, Tablet, and Mobile responsive layout verification
- ✅ **0 console errors** and **0 hydration warnings**

---

## 12. Known Limitations

- **Frontend Only**: No backend server or API routes are attached in this phase.
- **Simulated Auth**: Google login is simulated for demonstration without external OAuth client IDs.
- **Local Storage**: Data changes are persisted locally within the user's browser session.

---

## 13. Future Backend Integration

Planned future backend integration includes:
- **NestJS Server**: RESTful APIs for authentication, tasks, projects, members, and audit logs.
- **Database**: Database persistence (e.g. PostgreSQL / MongoDB with Prisma / TypeORM).
- **Authentication**: Real Google OAuth 2.0 integration with JWT session management.

---

## 14. Live Demo & Repository

- **Live Demo**: `<YOUR_LIVE_DEPLOYMENT_URL>`
- **GitHub Repository**: `https://github.com/Lalitpanchole/task_manament.git`

---

## 15. AI Usage

AI tools were used during development as permitted by the assessment instructions.

AI assistance was utilized for:
- Initial project scaffolding & architectural guidance
- Figma screenshot visual alignment & layout implementation
- Component refactoring and TypeScript typing
- Runtime QA verification & documentation generation

The code and user flows were thoroughly reviewed, debugged, and verified through runtime testing.

---

## 16. Assessment Note

This project was developed as part of the **AbleSpace Full Stack Developer (Fresher)** technical assessment.
