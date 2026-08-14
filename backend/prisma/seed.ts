import { PrismaClient, TaskStatus, TaskPriority, ProjectStatus, UserType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AbleSpace database...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.taskMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.label.deleteMany();
  await prisma.user.deleteMany();

  // Create Users / Members
  const userDexter = await prisma.user.create({
    data: {
      id: 'user-1',
      name: 'Dexter',
      email: 'dexter@gmail.com',
      username: 'Dexuser',
      title: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Designer',
      userType: UserType.guest,
    },
  });

  const memberAdmin = await prisma.user.create({
    data: {
      id: 'm-1',
      name: 'Admin',
      email: 'admin@ablespace.io',
      username: 'admin',
      title: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'Admin',
      userType: UserType.regular,
    },
  });

  const memberQA = await prisma.user.create({
    data: {
      id: 'm-2',
      name: 'QA Team',
      email: 'qa@ablespace.io',
      username: 'qateam',
      title: 'QA Engineer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      role: 'QA Engineer',
      userType: UserType.regular,
    },
  });

  const memberDesigner = await prisma.user.create({
    data: {
      id: 'm-3',
      name: 'Designer',
      email: 'designer@ablespace.io',
      username: 'designer',
      title: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Product Designer',
      userType: UserType.regular,
    },
  });

  const memberSecurity = await prisma.user.create({
    data: {
      id: 'm-4',
      name: 'Security',
      email: 'security@ablespace.io',
      username: 'security',
      title: 'Security Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Security Lead',
      userType: UserType.regular,
    },
  });

  const memberCN = await prisma.user.create({
    data: {
      id: 'm-5',
      name: 'CN',
      email: 'cn@ablespace.io',
      username: 'cn',
      title: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Developer',
      userType: UserType.regular,
    },
  });

  const memberAbhay = await prisma.user.create({
    data: {
      id: 'm-6',
      name: 'Abhay',
      email: 'abhay@ablespace.io',
      username: 'abhay',
      title: 'Fullstack Dev',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      role: 'Fullstack Dev',
      userType: UserType.regular,
    },
  });

  // Create Projects
  const proj1 = await prisma.project.create({
    data: {
      id: 'proj-1',
      name: 'Design Homepage',
      description: 'Redesign main landing page and high converting call to actions.',
      priority: TaskPriority.HIGH,
      leadId: memberQA.id,
      dueDate: '2026-09-12',
      status: ProjectStatus.Active,
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      id: 'proj-2',
      name: 'Develop Login Feature',
      description: 'Frontend authentication and workspace guest entry flows.',
      priority: TaskPriority.LOW,
      leadId: memberCN.id,
      dueDate: '2026-09-15',
      status: ProjectStatus.Active,
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      id: 'proj-3',
      name: 'Test Payment Gateway',
      description: 'Integrate payment provider sandbox and test checkout webhooks.',
      priority: TaskPriority.MEDIUM,
      leadId: memberAbhay.id,
      dueDate: '2026-09-18',
      status: ProjectStatus.Active,
    },
  });

  // Create Labels
  const labelsList = ['Research', 'Design', 'Development', 'Testing', 'Deployment', 'Review', 'Audit', 'Scheduled', 'UI', 'Auth', 'Frontend', 'Payments', 'Passed', 'Updated'];
  const labelMap: Record<string, string> = {};
  for (const name of labelsList) {
    const l = await prisma.label.create({ data: { name } });
    labelMap[name] = l.id;
  }

  // Create Tasks
  const task1 = await prisma.task.create({
    data: {
      id: 'task-1',
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDate: '2026-07-20',
      dueDate: '2026-07-31',
      projectId: proj1.id,
      reporterId: memberAdmin.id,
      members: {
        create: [{ userId: memberAdmin.id }, { userId: memberDesigner.id }],
      },
      labels: {
        create: [
          { labelId: labelMap['Research'] },
          { labelId: labelMap['Design'] },
          { labelId: labelMap['Development'] },
          { labelId: labelMap['Testing'] },
          { labelId: labelMap['Deployment'] },
        ],
      },
      subtasks: {
        create: [
          { id: 'sub-1', title: 'Subtask 1', completed: false, priority: TaskPriority.HIGH, memberId: memberQA.id, dueDate: '2026-09-12' },
          { id: 'sub-2', title: 'Subtask 2', completed: false, priority: TaskPriority.LOW, memberId: memberCN.id, dueDate: '2026-09-15' },
          { id: 'sub-3', title: 'Subtask 3', completed: true, priority: TaskPriority.MEDIUM, memberId: memberAbhay.id, dueDate: '2026-09-18' },
        ],
      },
      resources: {
        create: [
          { id: 'res-1', title: 'API Specification Draft', url: 'https://swagger.io' },
          { id: 'res-2', title: 'Figma System Specs', url: 'https://figma.com' },
        ],
      },
      comments: {
        create: [
          {
            id: 'c-1',
            userId: userDexter.id,
            content: 'dsds',
          },
        ],
      },
      updates: {
        create: [
          { id: 'u-1', userId: userDexter.id, text: 'changed priority from No priority to Urgent' },
          { id: 'u-2', userId: userDexter.id, text: 'posted an update' },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      id: 'task-2',
      title: 'Code Review Completed',
      description: 'Comprehensive code review for auth flow and workspace routing.',
      status: TaskStatus.DOING,
      priority: TaskPriority.MEDIUM,
      dueDate: '2026-07-29',
      projectId: proj2.id,
      reporterId: memberAdmin.id,
      members: { create: [{ userId: memberAdmin.id }] },
      labels: { create: [{ labelId: labelMap['Deployment'] }, { labelId: labelMap['Review'] }] },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      id: 'task-3',
      title: 'Implement Search Function',
      description: 'Add real time title filtering across task management board and list views.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: '2026-07-29',
      projectId: proj1.id,
      reporterId: memberAdmin.id,
      members: { create: [{ userId: memberAdmin.id }] },
      labels: { create: [{ labelId: labelMap['Deployment'] }, { labelId: labelMap['Review'] }] },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      id: 'task-4',
      title: 'Design Mockups Finalized',
      description: 'Finalize UI assets and high fidelity prototypes in Figma.',
      status: TaskStatus.DOING,
      priority: TaskPriority.HIGH,
      dueDate: '2026-07-29',
      projectId: proj1.id,
      reporterId: memberDesigner.id,
      members: { create: [{ userId: memberAdmin.id }] },
      labels: { create: [{ labelId: labelMap['Deployment'] }, { labelId: labelMap['Review'] }] },
    },
  });

  const task5 = await prisma.task.create({
    data: {
      id: 'task-5',
      title: 'Deploy to Production',
      description: 'Prepare production bundle and verify environment variables.',
      status: TaskStatus.TODO,
      priority: TaskPriority.URGENT,
      dueDate: '2026-07-29',
      projectId: proj2.id,
      reporterId: memberAdmin.id,
      members: { create: [{ userId: memberAdmin.id }] },
      labels: { create: [{ labelId: labelMap['Deployment'] }, { labelId: labelMap['Review'] }] },
    },
  });

  const task6 = await prisma.task.create({
    data: {
      id: 'task-6',
      title: 'Feature Testing Passed',
      description: 'End-to-end user journey tests completed for tasks and board view.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: '2026-07-30',
      projectId: proj3.id,
      reporterId: memberQA.id,
      members: { create: [{ userId: memberQA.id }] },
      labels: { create: [{ labelId: labelMap['Testing'] }, { labelId: labelMap['Passed'] }] },
    },
  });

  const task7 = await prisma.task.create({
    data: {
      id: 'task-7',
      title: 'UI Design Updated',
      description: 'Polished component spacing, theme badges and dropdown menus.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: '2026-07-31',
      projectId: proj1.id,
      reporterId: memberDesigner.id,
      members: { create: [{ userId: memberDesigner.id }] },
      labels: { create: [{ labelId: labelMap['Design'] }, { labelId: labelMap['Updated'] }] },
    },
  });

  const task8 = await prisma.task.create({
    data: {
      id: 'task-8',
      title: 'Security Audit Scheduled',
      description: 'Vulnerability assessment and session security check.',
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: '2026-08-01',
      projectId: proj3.id,
      reporterId: memberSecurity.id,
      members: { create: [{ userId: memberSecurity.id }] },
      labels: { create: [{ labelId: labelMap['Audit'] }, { labelId: labelMap['Scheduled'] }] },
    },
  });

  const task9 = await prisma.task.create({
    data: {
      id: 'task-9',
      title: 'Design Homepage',
      description: 'Main homepage design and layout implementation.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: '2026-09-12',
      projectId: proj1.id,
      reporterId: memberQA.id,
      members: { create: [{ userId: memberQA.id }] },
      labels: { create: [{ labelId: labelMap['Design'] }, { labelId: labelMap['UI'] }] },
    },
  });

  const task10 = await prisma.task.create({
    data: {
      id: 'task-10',
      title: 'Develop Login Feature',
      description: 'Guest entry and simulated Google OAuth integration.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: '2026-09-15',
      projectId: proj2.id,
      reporterId: memberCN.id,
      members: { create: [{ userId: memberCN.id }] },
      labels: { create: [{ labelId: labelMap['Auth'] }, { labelId: labelMap['Frontend'] }] },
    },
  });

  const task11 = await prisma.task.create({
    data: {
      id: 'task-11',
      title: 'Test Payment Gateway',
      description: 'Verify payment modal and checkout response states.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: '2026-09-18',
      projectId: proj3.id,
      reporterId: memberAbhay.id,
      members: { create: [{ userId: memberAbhay.id }] },
      labels: { create: [{ labelId: labelMap['Testing'] }, { labelId: labelMap['Payments'] }] },
    },
  });

  console.log('Database successfully seeded with users, projects, tasks, subtasks, and comments!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
