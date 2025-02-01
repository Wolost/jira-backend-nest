import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateTaskDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly projectId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly priorityId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly typeId: number;

  @ApiProperty()
  @IsInt()
  readonly assigneeId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly reporterId?: number;
  
}
