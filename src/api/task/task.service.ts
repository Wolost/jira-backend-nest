import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskPriority } from '../lov/enum/index'

@Injectable()
export class TaskService {

  constructor(private readonly prisma: PrismaService) { }

  async paginate({ options, userId, filters }: {
    options: { page: number; limit: number };
    userId: number;
    filters?: { projectId?: string; priority?: string; assigneeId?: string; TaskPriority?: TaskPriority };
  }) {
    const page = Number(options.page);
    const limit = Number(options.limit);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.TaskPriority === TaskPriority.LOW) {
      where.taskId = 1;
    } else if (filters.TaskPriority === TaskPriority.MEDIUM) {
      where.taskId = 2;
    } else if (filters.TaskPriority === TaskPriority.URGENT) {
      where.taskId = 3;
    }

    if (filters?.projectId) {
      where.projectId = parseInt(filters.projectId);
    }
    if (filters?.priority) {
      where.priority = { value: filters.priority.toUpperCase() };
    }
    if (filters?.assigneeId) {
      where.assigneeId = parseInt(filters.assigneeId);
    }

    const [data, total] = await Promise.all([
      this.prisma.tasks.findMany({
        where,
        include: {
          type: true,
          priority: true,
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.tasks.count({ where }),
    ]);

    return { data, total, page, limit };
  }


  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description ?? null,
        reporterId: createTaskDto.reporterId,
        assigneeId: createTaskDto.assigneeId ?? null,
        projectId: createTaskDto.projectId,
        priorityId: createTaskDto.priorityId ? createTaskDto.priorityId : null,
        typeId: createTaskDto.typeId ? createTaskDto.typeId : null,
      },
    });
  }

  async getByTaskId(taskId: string) {
    return this.prisma.tasks.findUnique({
      where: { taskId: taskId },
      include: { type: true, priority: true },
    });
  }

  async save(entity: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: {
        title: entity.title,
        description: entity.description,
        projectId: entity.projectId,
        priority: { connect: { id: entity.priorityId } },
        type: { connect: { id: entity.typeId } },
        assigneeId: entity.assigneeId,
        reporterId: entity.reporterId,
      },
    });
  }
  async update(updateTaskDto: UpdateTaskDto) {
    const { id, ...data } = updateTaskDto;
    return this.prisma.tasks.update({
      where: { id },
      data,
    });
  }

}
