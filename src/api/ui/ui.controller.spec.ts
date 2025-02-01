import { Test, TestingModule } from '@nestjs/testing';
import { UiController } from './ui.controller';
import { LovService } from './../lov/lov.service';
import { ProjectService } from './../project/project.service';
import { TaskService } from './../task/task.service';
import { UserService } from './../user/user.service';

describe('UiController', () => {
    let uiController: UiController;
    let lovService: LovService;
    let projectService: ProjectService;
    let taskService: TaskService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UiController],
            providers: [
                {
                    provide: LovService,
                    useValue: {
                        findAllByType: jest.fn().mockResolvedValue([]),
                    },
                },
                {
                    provide: ProjectService,
                    useValue: {
                        paginate: jest.fn().mockResolvedValue({ items: [] }),
                    },
                },
                {
                    provide: TaskService,
                    useValue: {
                        paginate: jest.fn().mockResolvedValue({ data: [] }),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        uiController = module.get<UiController>(UiController);
        lovService = module.get<LovService>(LovService);
        projectService = module.get<ProjectService>(ProjectService);
        taskService = module.get<TaskService>(TaskService);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(uiController).toBeDefined();
    });

    it('should get create-task config', async () => {
        await expect(uiController.createTask({ user: { id: 1 } })).resolves.toEqual({
            priorities: [],
            types: [],
            projects: [],
            users: [],
        });
    });

    it('should get login header', async () => {
        await expect(uiController.loginHeader({ user: { id: 1 } })).resolves.toEqual({
            projects: [],
            tasks: [],
        });
    });
});