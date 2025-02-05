import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear LOVs (List of Values)
  await prisma.lovs.createMany({
    data: [
      // Priorities
      { text: 'Low', type: 'TASK_PRIORITY', value: 'LOW' },
      { text: 'Medium', type: 'TASK_PRIORITY', value: 'MEDIUM' },
      { text: 'Urgent', type: 'TASK_PRIORITY', value: 'URGENT' },
      // Types
      { text: 'Task', type: 'TASK_TYPE', value: 'TASK' },
      { text: 'Bug', type: 'TASK_TYPE', value: 'BUG' },
      { text: 'Story', type: 'TASK_TYPE', value: 'STORY' },
    ],
  });

  await prisma.users.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: '$2b$10$IePM/c3xQSsFosDXTt8HHOpJbc0aRaSmKCbu88JLoKGc5m9TDASA2',
      role: 'admin',
      language: 'en-US',
    },
  });

  await prisma.projects.create({
    data: {
      createdAt: new Date('2025-01-29T04:31:59.000Z'),
      updatedAt: new Date('2025-02-01T04:53:22.048Z'),
      id: 1,
      code: 'PRJ456',
      title: 'Second Project',
      description: 'Second sample project',
      isCompleted: false,
      createdBy: 1,
    },
  });

  await prisma.tasks.create({
    data: {
      createdAt: new Date('2025-01-29T04:41:05Z'),
      updatedAt: new Date('2025-01-29T04:41:05Z'),
      id: 1,
      title: 'Implement Feature',
      description: 'Develop a new feature',
      reporterId: 1,
      assigneeId: 2,
      projectId: 1,
      typeId: 3,
      priorityId: 2,
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });