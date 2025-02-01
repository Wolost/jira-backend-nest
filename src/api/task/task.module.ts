import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../database/prisma.service';
import { LovService } from '../lov/lov.service';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, LovService, ProjectService],
})

export class TaskModule {}
