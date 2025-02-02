import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { LovModule } from './lov/lov.module';
import { UiModule } from './ui/ui.module';
import { PingModule } from '../ping/ping.module';
@Module({
  imports: [ UserModule, AuthModule, ProjectModule, TaskModule, LovModule, UiModule, PingModule ],
})

export class ApiModule {}
