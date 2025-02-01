import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)

  readonly id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly taskId: string;
  
}
