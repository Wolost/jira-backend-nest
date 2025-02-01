import { Lov } from '../../lov/lov.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../project/project.entity';
import { UserInfo } from './user-info';

export interface CreateTaskConfig {
  priorities: Lov[];
  types: Lov[];
  projects: Project[];
  users: UserInfo[];
}

export class CreateTaskConfig {

  @ApiProperty({ type: () => [Lov] })
  priorities: Lov[];

  @ApiProperty({ type: () => [Lov] })
  types: Lov[];

  @ApiProperty({ type: () => [Project] })
  projects: Project[];

  @ApiProperty({ type: () => [Object], description: 'List of users with id and fullName' })
  users: { id: number; fullName: string }[];
  
}