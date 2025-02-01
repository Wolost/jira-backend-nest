import { Controller, Get, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LovService } from './lov.service';
import { LovType } from './enum';

@ApiTags('List of Values')
@Controller('lovs')
export class LovController {
  constructor(private readonly lovService: LovService) {}

  @Get('type/:type')
  @ApiOperation({ summary: 'Get all LOVs by type' })
  @ApiParam({name: 'type',required: true,enum: LovType,description: 'The type of LOV to retrieve (e.g., TASK_TYPE, TASK_PRIORITY)'})
  @ApiResponse({status: HttpStatus.OK,description: 'Successfully retrieved LOVs'})
  @ApiResponse({status: HttpStatus.BAD_REQUEST,description: 'Invalid LOV type provided'})
  findAllByType(
    @Param('type') type: LovType,
  ) {
    return this.lovService.findAllByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get LOV by ID' })
  @ApiParam({name: 'id',required: true,description: 'The ID of the LOV to retrieve',type: Number})
  @ApiResponse({status: HttpStatus.OK,description: 'Successfully retrieved LOV'})
  @ApiResponse({status: HttpStatus.NOT_FOUND,description: 'LOV with provided ID not found'})
  @ApiResponse({status: HttpStatus.BAD_REQUEST,description: 'Invalid ID format'})
  findById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    id: number,
  ) {
    return this.lovService.findById(id);
  }
}