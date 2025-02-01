import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { LovService } from '../lov/lov.service';
import { LovType, toTaskPriority, toTaskType } from '../lov/enum';
import { CreateTaskConfig, LoginHeader } from './models';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskPriority } from '../lov/enum/index'
import { UserService } from '../user/user.service';

@ApiTags('ui')
@Controller('/ui')
export class UiController {

  constructor(
    private readonly lovService: LovService,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) { }

  @Get('/create-task')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get configuration for task creation', description: 'Retrieves all necessary data for creating a new task including priorities, types, recent projects, and users' })
  @ApiResponse({ status: 200, description: 'Configuration data successfully retrieved', type: CreateTaskConfig})
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  async createTask(@Req() req): Promise<CreateTaskConfig> {
    const user = req.user;
    const priorities = await this.lovService.findAllByType(LovType.TASK_PRIORITY);
    const types = await this.lovService.findAllByType(LovType.TASK_TYPE);
    const projects = await this.last3Projects(user.id);
    const users = await this.userService.findAll();

    return {
      priorities,
      types,
      projects,
      users: users.map(user => ({
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''} - ${user.email}`,
      })),
    };
  }

  @Get('/login-header')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user login header data', description: 'Retrieves user-specific data for the login header including recent projects and assigned tasks' })
  @ApiResponse({ status: 200, description: 'Login header data successfully retrieved', type: LoginHeader })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid' })
  async loginHeader(@Req() req): Promise<LoginHeader> {
    const user = req.user;
    const projects = await this.last3Projects(user.id);
    const tasks = await this.taskService.paginate({
      options: {
        page: 1,
        limit: 5,
      },
      userId: user.id,
      filters: { TaskPriority: TaskPriority.URGENT },
      
    });
    return {
      projects,
      tasks: tasks.data.map(task => ({
        ...task,
        type: {
          id: task.type.id,
          value: task.type.type === LovType.TASK_TYPE
            ? toTaskType(task.type.value)
            : toTaskPriority(task.type.value),
          text: task.type.text,
          type: task.type.type as LovType,
          createdAt: task.type.createdAt ?? null,
          updatedAt: task.type.updatedAt ?? null,
        },
        priority: {
          id: task.priority.id,
          value: toTaskPriority(task.priority.value),
          text: task.priority.text,
          type: task.type.type as LovType,
          createdAt: task.priority.createdAt ?? null,
          updatedAt: task.priority.updatedAt ?? null,
        },
      })),
    };
  }

  private async last3Projects(userId): Promise<any[]> {
    const projects = await this.projectService.paginate({
      options: {
        limit: 3,
        page: 1,
      },
      userId,
    });
    return projects.items;
  }
  
}
