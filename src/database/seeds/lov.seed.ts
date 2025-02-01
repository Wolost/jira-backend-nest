import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
