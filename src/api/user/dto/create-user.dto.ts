import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
    ADMIN = 'admin',
    TEAM_MEMBER = 'team_member'
}

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ enum: UserRole, default: UserRole.TEAM_MEMBER })
    @IsEnum(UserRole)
    @IsNotEmpty()
    readonly role: UserRole = UserRole.TEAM_MEMBER;
}
