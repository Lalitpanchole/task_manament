# AbleSpace Task Management System (Full Stack Assessment)

A modern, responsive, and complete Full Stack Task Management System developed for the **AbleSpace Technical Assessment**. Built strictly based on the provided 14 Figma reference screens, this application delivers an end-to-end task management experience powered by a **NestJS REST API backend**, **MySQL database (via XAMPP)** with **Prisma ORM**, **JWT Authentication**, **Swagger OpenAPI Documentation**, and a **Next.js App Router frontend**.

---

## 1. System Architecture

```
+------------------------------------+          REST APIs           +----------------------------------+
|   Next.js Frontend (App Router)    |  <=======================>   |   NestJS Backend Service (Port 4000)|
|   - React 19 / TypeScript          |   Headers: Bearer <JWT>     |   - Auth & Passport JWT Guards       |
|   - Tailwind CSS                   |                              |   - DTO Validation Pipes             |
|   - React Context API Layer        |                              |   - Controllers & Services           |
|   - Figma 14 Screens (100% Fidelity)|                              |   - Swagger OpenAPI Docs (/api/docs) |
+------------------------------------+                              +----------------------------------+
                                                                                     |
                                                                              Prisma ORM Client
                                                                                     |
                                                                                     v
                                                                        +--------------------------+
                                                                        |   MySQL DB (via XAMPP)   |
                                                                        |   Database: ablespace_db |
                                                                        |   (Tables & FK Relations)|
                                                                        +--------------------------+
```

---

## 2. Tech Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: MySQL (running via XAMPP)
- **ORM**: Prisma ORM 5
- **Authentication**: JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`)
- **API Specification**: Swagger / OpenAPI 7 (`/api/docs`)
- **Validation**: `class-validator`, `class-transformer`
- **Testing**: Jest unit tests

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Context (`AuthContext`, `TaskContext`, `ThemeContext`)
- **API Client**: Service layer wrapper (`src/lib/api.ts`)

---

## 3. Database Schema & Entities

The relational MySQL database schema strictly models all entities required by the application:

- **`User`**: `id`, `name`, `email`, `username`, `title`, `avatar`, `role`, `userType` ('guest'|'google'|'regular'), `createdAt`, `updatedAt`
- **`Project`**: `id`, `name`, `description`, `priority`, `status`, `dueDate`, `leadId` (FK -> User), `createdAt`, `updatedAt`
- **`Task`**: `id`, `projectId` (FK -> Project), `reporterId` (FK -> User), `title`, `description`, `status`, `priority`, `startDate`, `dueDate`, `createdAt`, `updatedAt`
- **`Subtask`**: `id`, `taskId` (FK -> Task), `memberId` (FK -> User), `title`, `completed`, `priority`, `dueDate`, `createdAt`, `updatedAt`
- **`Comment`**: `id`, `taskId` (FK -> Task), `userId` (FK -> User), `content`, `createdAt`, `updatedAt`
- **`Resource`**: `id`, `taskId` (FK -> Task), `title`, `url`, `createdAt`
- **`Label`**: `id`, `name`
- **`TaskLabel`**: `taskId`, `labelId` (Many-to-Many join table)
- **`TaskMember`**: `taskId`, `userId` (Many-to-Many join table)
- **`ActivityLog`**: `id`, `taskId` (FK -> Task), `userId` (FK -> User), `text`, `createdAt`
- **`UserSettings`**: `id`, `userId` (FK -> User), `fieldPreferences` (JSON)

---

## 4. REST API Endpoints

### Health
- `GET /api/health` - Check NestJS server and MySQL database connectivity status.

### Authentication
- `POST /api/auth/guest` - Authenticate or create Guest session & issue JWT.
- `POST /api/auth/google` - Simulated Google OAuth authentication & issue JWT.
- `GET /api/auth/me` - Get current authenticated user profile.
- `POST /api/auth/logout` - Invalidate current session token.

### Users / Profile
- `GET /api/users` - List all workspace users/members.
- `GET /api/users/me` - Get profile details of logged in user.
- `GET /api/users/:id` - Get user details by ID.
- `PATCH /api/users/me` - Update profile of logged in user.

### Tasks
- `GET /api/tasks` - List & filter tasks (query params: `search`, `status`, `priority`, `projectId`, `dueDate`, `memberId`, `labelId`).
- `GET /api/tasks/:id` - Get task details with subtasks, comments, resources, members, and activity stream.
- `POST /api/tasks` - Create a new task.
- `PATCH /api/tasks/:id` - Update task status, priority, title, dates, or project relation.
- `DELETE /api/tasks/:id` - Delete a task.
- `POST /api/tasks/:id/members` - Toggle member assignment.
- `POST /api/tasks/:id/labels` - Toggle label tag.
- `POST /api/tasks/:id/resources` - Add document link / resource.

### Subtasks
- `GET /api/tasks/:taskId/subtasks` - List subtasks for task.
- `POST /api/tasks/:taskId/subtasks` - Create subtask.
- `PATCH /api/subtasks/:id` - Update subtask details or completion state.
- `DELETE /api/subtasks/:id` - Delete subtask.

### Comments
- `GET /api/tasks/:taskId/comments` - List comments on task.
- `POST /api/tasks/:taskId/comments` - Post comment on task.
- `DELETE /api/comments/:id` - Delete comment.

### Activity History
- `GET /api/tasks/:taskId/activity` - Get task audit activity timeline logs.

### Projects
- `GET /api/projects` - List workspace projects with task counts.
- `GET /api/projects/:id` - Get project details.
- `POST /api/projects` - Create project.
- `PATCH /api/projects/:id` - Update project.
- `DELETE /api/projects/:id` - Delete project.
- `GET /api/projects/:id/tasks` - Get tasks assigned to specific project.

### Labels & Settings
- `GET /api/labels`, `POST /api/labels`, `PATCH /api/labels/:id`, `DELETE /api/labels/:id`
- `GET /api/settings`, `PATCH /api/settings`

---

## 5. Getting Started & Setup Instructions

### Prerequisites
- Node.js (v18+)
- XAMPP with MySQL server running on `localhost:3306`

### 1. Database Setup (XAMPP)
Start XAMPP Control Panel and ensure **MySQL module** is running.

### 2. Backend Installation & Start

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   DATABASE_URL="mysql://root:@localhost:3306/ablespace_db"
   JWT_SECRET=ablespace_super_secret_jwt_key_2026
   JWT_EXPIRATION=7d
   ```

4. Run Prisma database migration:
   ```bash
   npx prisma db push
   ```

5. Seed MySQL database with assessment dataset:
   ```bash
   npx prisma db seed
   ```

6. Start NestJS backend in development mode:
   ```bash
   npm run start:dev
   ```
   - Server running at: `http://localhost:4000/api`
   - Swagger OpenAPI Docs: `http://localhost:4000/api/docs`

### 3. Frontend Installation & Start

1. In root directory:
   ```bash
   npm install
   ```

2. Start Next.js development server:
   ```bash
   npm run dev
   ```
   - Frontend running at: `http://localhost:3000`

---

## 6. Testing & Quality Assurance

### Automated Testing
- **NestJS Unit Tests**:
  ```bash
  cd backend
  npm run test
  ```
  *Result*: 2 Test Suites Passed, 4 Tests Passed (HealthController & AuthService specs).

- **Production Build Verification**:
  ```bash
  # Frontend Build
  npm run build

  # Backend Build
  cd backend
  npm run build
  ```
  *Result*: 0 TypeScript errors, 0 build errors.

### Manual & E2E Verification
- ✅ **Database Connectivity**: MySQL `ablespace_db` created and schema synchronized via Prisma.
- ✅ **Seed Data**: Users (Dexter, Admin, QA, Designer, Security, CN, Abhay), Projects, Tasks, Subtasks, and Comments loaded into MySQL.
- ✅ **Auth Workflow**: Guest Login & Google Simulated OAuth issuing valid JWT bearer tokens.
- ✅ **Task CRUD**: Creating, editing status/priority, toggling subtasks, posting comments, and creating audit activity logs persisted in MySQL.
- ✅ **Projects & Filtering**: Multi-level filter options and project-scoped task routes reading live from backend.
- ✅ **Swagger UI**: Verified interactive API testing interface at `http://localhost:4000/api/docs`.

---

## 7. Assessment Note

This project was developed for the **AbleSpace Technical Assessment**, delivering a complete Next.js frontend integrated with a NestJS & MySQL backend service.
