import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;
  let mockResponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            paginate: jest.fn().mockResolvedValue({ items: [], meta: {} }),
            findByCode: jest.fn(),
            create: jest.fn().mockResolvedValue(true),
            update: jest.fn().mockResolvedValue(true),
            complete: jest.fn().mockResolvedValue(true),
            findById: jest.fn().mockResolvedValue({ id: 1 }),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    projectController = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
    mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
  });

  it('should be defined', () => {
    expect(projectController).toBeDefined();
  });

  it('should paginate projects', async () => {
    await expect(projectController.paginate({ user: { id: 1 } }, 1, 10)).resolves.toEqual({ items: [], meta: {} });
  });

  it('should get project by code', async () => {
    projectService.findByCode = jest.fn().mockResolvedValue(1);
    await expect(projectController.getByCode({ code: 'TEST' })).resolves.toEqual(1);
  });

  it('should create a project', async () => {
    await projectController.create({ user: { id: 1 } }, mockResponse, {
        code: 'TEST',
        title: '',
        description: ''
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should update a project', async () => {
    await projectController.update(mockResponse, {} as UpdateProjectDto);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should complete a project', async () => {
    await projectController.completeProject(mockResponse, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should delete a project', async () => {
    await projectController.delete(mockResponse, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
