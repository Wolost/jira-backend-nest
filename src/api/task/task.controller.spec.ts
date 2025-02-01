import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskController', () => {
    let controller: TaskController;
    let service: TaskService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [
                {
                    provide: TaskService,
                    useValue: {
                        create: jest.fn().mockResolvedValue({
                            id: 1,
                            title: 'Test Task',
                            description: 'Task Description',
                            projectId: 1,
                            priorityId: 1,
                            typeId: 1,
                            assigneeId: 1,
                            reporterId: 1,
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<TaskController>(TaskController);
        service = module.get<TaskService>(TaskService);
    });

    it('should create new task', async () => {
        const taskDto: CreateTaskDto = {
            title: 'Test Task',
            description: 'Task Description',
            projectId: 1,
            priorityId: 1,
            typeId: 1,
            assigneeId: 1,
        };

        expect(await controller.create({ user: { id: 1 } }, taskDto)).toEqual({
            id: 1,
            ...taskDto,
            reporterId: 1,
        });
    });
});
