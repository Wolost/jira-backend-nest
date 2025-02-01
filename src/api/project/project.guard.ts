import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ProjectService } from './project.service';
import { User } from '../user/user.entity';

@Injectable()
export class ProjectGuard implements CanActivate {

  constructor(private readonly projectService: ProjectService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const projectCode = request.params.code;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const project = await this.projectService.findByCode(projectCode);
    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    if (project.createdBy === user.id || request.user.role === 'admin') {
      return true;
    }
    throw new ForbiddenException('User does not have permission to update this project');
  }
}
