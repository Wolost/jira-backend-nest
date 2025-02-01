import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../database/prisma.service';

describe('TaskService', () => {
    let service: TaskService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TaskService, PrismaService],
        }).compile();

        service = module.get<TaskService>(TaskService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create new task', async () => {
        const taskData = {
            title: 'New Task',
            description: 'Task Description',
            projectId: 1,
            priorityId: 1,
            typeId: 1,
            assigneeId: 1,
            reporterId: 1,
        };

        jest.spyOn(prisma.tasks, 'create').mockResolvedValue(taskData as any);
        expect(await service.create(taskData)).toEqual(taskData);
    });
});
