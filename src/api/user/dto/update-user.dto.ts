import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
    ADMIN = 'admin',
    USER = 'team_member'
}

export class UpdateUserDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}