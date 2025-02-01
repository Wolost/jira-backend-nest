import { Test, TestingModule } from '@nestjs/testing';
import { LovService } from './lov.service';
import { PrismaService } from '../../database/prisma.service';
import { LovType } from './enum';

describe('LovService', () => {
    let lovService: LovService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LovService,
                {
                    provide: PrismaService,
                    useValue: {
                        lovs: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        lovService = module.get<LovService>(LovService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(lovService).toBeDefined();
    });

    it('should return list of values by type', async () => {
        const mockData = [{ id: 1, type: LovType.TASK_TYPE, value: 'Test' }];
        prisma.lovs.findMany = jest.fn().mockResolvedValue(mockData);
        await expect(lovService.findAllByType(LovType.TASK_TYPE)).resolves.toEqual(mockData);
        expect(prisma.lovs.findMany).toHaveBeenCalledWith({ where: { type: LovType.TASK_TYPE }, orderBy: { value: 'desc' } });
    });

    it('should return a value by id', async () => {
        const mockData = { id: 1, type: LovType.TASK_TYPE, value: 'Test' };
        prisma.lovs.findUnique = jest.fn().mockResolvedValue(mockData);
        await expect(lovService.findById(1)).resolves.toEqual(mockData);
        expect(prisma.lovs.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});
