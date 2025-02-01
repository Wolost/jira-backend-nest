import { Project } from '../../project/project.entity';
import { Task } from '../../task/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface LoginHeader {
  tasks: Task[];
  projects: Project[];
}

export class LoginHeader {

  @ApiProperty({ type: () => [Project] })
  projects: Project[];

  @ApiProperty({ type: () => [Task] })
  tasks: Task[];
  
}