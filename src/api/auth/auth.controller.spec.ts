import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { RegisterUserDto } from './dto';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn().mockResolvedValue({ access_token: 'token' }),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        findOneByEmail: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    it('should login a user', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        await expect(authController.login(req)).resolves.toEqual({ access_token: 'token' });
        expect(authService.login).toHaveBeenCalledWith(req.body);
    });

    it('should register a user', async () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
        const registerUserDto: RegisterUserDto = {
            email: 'test@example.com', password: 'password',
            firstName: '',
            lastName: ''
        };
        await authController.register(res, registerUserDto);
        expect(userService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
        expect(userService.create).toHaveBeenCalledWith(registerUserDto);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(res.send).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
    });

    it('should get user profile', () => {
        const req = { user: { id: 1, email: 'test@example.com', password: 'hashed' } };
        expect(authController.getProfile(req)).toEqual({ id: 1, email: 'test@example.com' });
    });
});