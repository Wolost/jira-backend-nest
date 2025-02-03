import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CreateProjectDto } from './dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {

  constructor(private readonly prisma: PrismaService) { }

  async create(params: CreateProjectDto & { createdBy: number }) {
    return this.prisma.projects.create({
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });
  }
  async findByCode(code: string): Promise<Project | null> {
    return this.prisma.projects.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async findById(id: number): Promise<Project> {
    return this.prisma.projects.findUnique({ where: { id } });
  }

  async paginate({ options, userId }: { options: IPaginationOptions; userId: number }): Promise<Pagination<any>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.projects.findMany({
        where: { createdBy: userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.projects.count({ where: { createdBy: userId } }),
    ]);

    return new Pagination(data, {
      totalItems: total,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  }

  async update(updateProjectDto: UpdateProjectDto) {
    return this.prisma.projects.update({
      where: { id: updateProjectDto.id },
      data: { isCompleted: true },
    });
  }

  async updateByCode(code: string, updateData: { title?: string; description?: string }) {
    const project = await this.prisma.projects.findUnique({ where: { code: code.toUpperCase() } });

    if (!project) {
      throw new Error(`Project with code ${code} not found.`);
    }

    return this.prisma.projects.update({
      where: { code: code.toUpperCase() },
      data: {
        title: updateData.title,
        description: updateData.description,
      },
    });
  }

  async complete(id: number) {
    return this.prisma.projects.update({
      where: { id },
      data: { isCompleted: true },
    });
  }

  async delete(id: number) {
    return this.prisma.projects.delete({ where: { id } });
  }

  async getAll() {
    return this.prisma.projects.findMany();
  }

  async save(entity: Partial<Project>): Promise<Project> {
    const { id, code, title, description, isCompleted, createdBy, createdAt, updatedAt } = entity;

    if (!code || !title || !createdBy) {
      throw new Error("Fields 'code', 'title', and 'createdBy' are required.");
    }

    const data = {
      code,
      title,
      description: description || null,
      isCompleted: isCompleted ?? false,
      createdBy,
      createdAt: createdAt || undefined,
      updatedAt: updatedAt || undefined,
    };

    if (id) {
      return this.prisma.projects.update({
        where: { id },
        data,
      });
    } else {
      return this.prisma.projects.create({
        data,
      });
    }
  }

}
