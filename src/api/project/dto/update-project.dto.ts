import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly description: string;
  
}
