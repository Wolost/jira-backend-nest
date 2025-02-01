import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LovType } from './enum';

@Injectable()
export class LovService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findAllByType(lovType: LovType): Promise<any[]> {
    return this.prisma.lovs.findMany({
      where: { type: lovType },
      orderBy: {
        value: 'desc',
      },
    });
  }

  async findById(id: number): Promise<any> {
    return this.prisma.lovs.findUnique({
      where: { id },
    });
  }
  
}
