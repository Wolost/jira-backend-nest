import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @Post('/login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return access token.' })
  @ApiBody({ description: 'User credentials', type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Successfully logged in and returned access token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  async login(@Req() req) {
    return this.authService.login(req.body);
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'User registration', description: 'Register a new user.' })
  @ApiBody({ description: 'User registration data', type: RegisterUserDto })
  @ApiResponse({ status: 200, description: 'User successfully registered.', type: RegisterUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request. Email already exists.' })
  async register(@Res() res, @Body() registerUserDto: RegisterUserDto) {
    const isRegistered = await this.userService.findOneByEmail(registerUserDto.email);
    if (isRegistered) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email you provided is existing.',
      });
      return;
    }

    const user = await this.userService.create(registerUserDto);
    if (user) {
      const { password, ...result } = user;

      res.status(HttpStatus.OK).send(result);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile', description: 'Retrieve the profile of the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  getProfile(@Req() req) {
    const { password, ...user } = req.user;
    return user;
  }
  
}
