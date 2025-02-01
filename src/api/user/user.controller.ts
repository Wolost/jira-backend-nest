import { ClassSerializerInterceptor, Controller, Get, Post, Delete, UseInterceptors, UseGuards, ValidationPipe, UsePipes, HttpStatus, Body, Param, Res, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('users')
@Controller('/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@ApiSecurity('roles', ['admin'])
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }))
export class UserController {

  constructor(private readonly usersService: UserService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve a list of all users. Only accessible by administrators.' })
  @ApiResponse({ status: 200, description: 'List of users successfully retrieved', })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have admin role' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async createUser(@Res() res,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })) createUserDto: CreateUserDto
  ) {

    const isRegistered = await this.usersService.findOneByEmail(createUserDto.email);
    if (isRegistered) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email you provided is existing.',
      });
      return;
    }

    const newUser = await this.usersService.create(createUserDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      user: newUser,
    });
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Param('id', new ValidationPipe({ transform: true })) id: number
  ) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user firstname, lastname or role' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async updateUser(
    @Param('id', new ValidationPipe({ transform: true })) id: number,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })) updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

}
