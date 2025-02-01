import { Body, Controller, DefaultValuePipe, Get, Param, ParseEnumPipe, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { TaskPriority } from '../lov/enum/index'

@ApiTags('tasks')
@Controller('/tasks')
export class TaskController {

  constructor(private readonly taskService: TaskService) { }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get paginated tasks', description: 'Retrieve a paginated list of tasks with optional TaskPriority filtering' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'Priority', enum: TaskPriority, required: false, description: 'Priority filter' })
  @ApiQuery({ name: 'projectId', type: String, required: false, description: 'Project ID filter' })
  @ApiQuery({ name: 'priority', type: String, required: false, description: 'Task priority filter' })
  @ApiQuery({ name: 'assigneeId', type: String, required: false, description: 'Assignee ID filter' })
  @ApiResponse({ status: 200, description: 'Tasks successfully retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  async paginate(
    @Req() req,
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10,
    @Query('Priority') TaskPriority?: TaskPriority,
    @Query('projectId') projectId?: string,
    @Query('priority') priority?: string,
    @Query('assigneeId') assigneeId?: string,
  ) {
    const user = req.user;
    return await this.taskService.paginate({
      options: { page, limit },
      userId: user.id,
      filters: { TaskPriority, projectId, priority, assigneeId },
    });
  }

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new task with the current user as reporter'
  })
  @ApiBody({ type: CreateTaskDto, description: 'Task creation data' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid task data' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    const user = req.user;
    return await this.taskService.create({ ...createTaskDto, reporterId: user.id });
  }

  @Get('/:taskId')
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieve a specific task by its ID'
  })
  @ApiParam({ name: 'taskId', type: String, description: 'ID of the task to retrieve' })
  @ApiResponse({ status: 200, description: 'Task successfully retrieved' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getByTaskId(@Param('taskId') taskId: string) {
    return await this.taskService.getByTaskId(taskId);
  }

  @Put('/update')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Update a task',
    description: 'Update an existing task'
  })
  @ApiBody({ type: UpdateTaskDto, description: 'Task update data' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.update(updateTaskDto);
  }

}
