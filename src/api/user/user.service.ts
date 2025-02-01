import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterUserDto, } from '../auth/dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(registerUserDto: RegisterUserDto) {
    const { password, ...rest } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.users.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOneByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async delete(id: number) {
    return this.prisma.users.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true
      }
    });
  }
}
