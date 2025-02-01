import { Module } from '@nestjs/common';
import { UiController } from './ui.controller';
import { LovService } from '../lov/lov.service';
import { ProjectService } from '../project/project.service';
import { SharedModule } from '../../shared';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [SharedModule],
  controllers: [UiController],
  providers: [LovService, ProjectService, TaskService, UserService, PrismaService],
})

export class UiModule { }
