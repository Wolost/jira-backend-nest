import { Module } from '@nestjs/common';
import { LovService } from './lov.service';
import { SharedModule } from '../../shared';
import { PrismaService } from '../../database/prisma.service';
import { LovController } from './lov.controller';

@Module({
  controllers: [LovController],
  imports: [SharedModule],
  providers: [LovService, PrismaService],
})

export class LovModule {}
