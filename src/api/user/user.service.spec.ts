import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../database/prisma.service';
import { RegisterUserDto } from '../auth/dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
    let userService: UserService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        users: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user with hashed password', async () => {
        const registerUserDto: RegisterUserDto = {
            email: 'test@example.com', password: 'password',
            firstName: '',
            lastName: ''
        };
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
       
        prisma.users.create = jest.fn().mockResolvedValue({ id: 1, email: registerUserDto.email, password: hashedPassword });
        await expect(userService.create(registerUserDto)).resolves.toEqual({ id: 1, email: registerUserDto.email, password: hashedPassword });
    });

    it('should return all users', async () => {
       
        prisma.users.findMany = jest.fn().mockResolvedValue([{ id: 1, email: 'test@example.com' }]);
        await expect(userService.findAll()).resolves.toEqual([{ id: 1, email: 'test@example.com' }]);
    });

    it('should find a user by email', async () => {
       
        prisma.users.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });
        await expect(userService.findOneByEmail('test@example.com')).resolves.toEqual({ id: 1, email: 'test@example.com' });
    });
});