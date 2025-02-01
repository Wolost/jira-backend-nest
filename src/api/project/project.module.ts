import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from '../../database/prisma.service';
import { SharedModule } from '../../shared';

@Module({
  imports: [SharedModule],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService],
})

export class ProjectModule {}
