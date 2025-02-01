import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../../database/prisma.service';

describe('ProjectService', () => {
    let projectService: ProjectService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                {
                    provide: PrismaService,
                    useValue: {
                        projects: {
                            create: jest.fn(),
                            findUnique: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        projectService = module.get<ProjectService>(ProjectService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(projectService).toBeDefined();
    });

    it('should create a project', async () => {
        const mockProject = { id: 1 };
        prisma.projects.create = jest.fn().mockResolvedValue(mockProject);
        await expect(projectService.create({
            code: 'TEST', title: 'Test Project', createdBy: 1,
            description: ''
        })).resolves.toEqual(mockProject);
    });

    it('should find a project by code', async () => {
        const mockProject = { id: 1 };
        prisma.projects.findUnique = jest.fn().mockResolvedValue(mockProject);
        await expect(projectService.findByCode('TEST')).resolves.toEqual(mockProject);
    });

    it('should find a project by id', async () => {
        const mockProject = { id: 1 };
        prisma.projects.findUnique = jest.fn().mockResolvedValue(mockProject);
        await expect(projectService.findById(1)).resolves.toEqual(mockProject);
    });

    it('should update a project', async () => {
        prisma.projects.update = jest.fn().mockResolvedValue(true);
        await expect(projectService.update({
            id: 1,
            code: '',
            title: '',
            description: ''
        })).resolves.toEqual(true);
    });

    it('should complete a project', async () => {
        prisma.projects.update = jest.fn().mockResolvedValue(true);
        await expect(projectService.complete(1)).resolves.toEqual(true);
    });

    it('should delete a project', async () => {
        prisma.projects.delete = jest.fn().mockResolvedValue(true);
        await expect(projectService.delete(1)).resolves.toEqual(true);
    });

    it('should get all projects', async () => {
        const mockProjects = [{ id: 1 }];
        prisma.projects.findMany = jest.fn().mockResolvedValue(mockProjects);
        await expect(projectService.getAll()).resolves.toEqual(mockProjects);
    });
});
