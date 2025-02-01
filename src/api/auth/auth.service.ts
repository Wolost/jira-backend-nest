import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const user = await this.prisma.users.findUnique({ where: { email: payload.email } });
    const exception = new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    if (!user) {
      throw exception;
    } else {
      const passwordMatched = await bcrypt.compare(payload.password, user.password);

      if (!passwordMatched) {
        throw exception;
      }
    }
    return user;
  }

  async login(user: any) {
    const checkedUser = await this.prisma.users.findUnique({ where: { email: user.email } });
    const exception = new HttpException('Bad Credentials', HttpStatus.UNAUTHORIZED);
    
    if (!checkedUser) {
      throw exception;
    } else {
      const passwordMatched = await bcrypt.compare(user.password, checkedUser.password);
      
      if (!passwordMatched) {
        throw exception;
      }

      user.role = checkedUser.role;
    }
    
    const payload = { email: user.email, password: user.password, role:user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
