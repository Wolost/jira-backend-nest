import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mocked-token'),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        users: {
                            findUnique: jest.fn().mockImplementation(async () => null),
                        },
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should validate user with correct credentials', async () => {
        const user = { email: 'test@example.com', password: await bcrypt.hash('password', 10) };
        prisma.users.findUnique = jest.fn().mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        await expect(authService.validateUser({ email: 'test@example.com', password: 'password' })).resolves.toEqual(user);
    });

    it('should throw exception for invalid user', async () => {
        prisma.users.findUnique = jest.fn().mockResolvedValue(null);
        await expect(authService.validateUser({ email: 'invalid@example.com', password: 'password' })).rejects.toThrow(HttpException);
    });

    it('should throw exception for incorrect password', async () => {
        const user = { email: 'test@example.com', password: await bcrypt.hash('password', 10) };
        prisma.users.findUnique = jest.fn().mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
        await expect(authService.validateUser({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(HttpException);
    });

    it('should return access token on login', async () => {
        const user = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password', 10) };
        prisma.users.findUnique = jest.fn().mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        await expect(authService.login({ email: 'test@example.com', password: 'password' })).resolves.toEqual({ access_token: 'mocked-token' });
    });
});