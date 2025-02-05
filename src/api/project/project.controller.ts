import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateProjectDto } from './dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ProjectGuard } from './project.guard';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('/projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectController {

  constructor(private readonly projectService: ProjectService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Paginate projects', description: 'Retrieve a paginated list of projects for the authenticated user.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved paginated projects.', type: Pagination<Project> })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  async paginate(@Req() req, @Query('page', new ParseIntPipe()) page = 1, @Query('limit', new ParseIntPipe()) limit = 10): Promise<Pagination<Project>> {
    const user = req.user as User;
    return await this.projectService.paginate({
      options: {
        page,
        limit,
      },
      userId: user.id,
    });
  }

  @Get('/:code')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get project by code', description: 'Retrieve a project by its unique code.' })
  @ApiParam({ name: 'code', type: String, description: 'Unique code of the project' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved project.', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  async getByCode(@Param() params): Promise<Project> {
    return await this.projectService.findByCode(params.code);
  }

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'team_member')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new project', description: 'Create a new project. Requires admin or team_member role.' })
  @ApiBody({ type: CreateProjectDto, description: 'Project creation data' })
  @ApiResponse({ status: 200, description: 'Project successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Project code already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have the required role.' })
  async create(@Req() req, @Res() res: Response, @Body(new ValidationPipe({ transform: true })) createProjectDto: CreateProjectDto) {
    const user = req.user as User;
    const code = createProjectDto.code.toLocaleUpperCase();
    const isExist = await this.projectService.findByCode(code);

    if (isExist) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Code you provided is existing.',
      });
    }

    const project = await this.projectService.create({ ...createProjectDto, createdBy: user.id });

    if (project) {
      res.status(HttpStatus.OK).json({
        message: 'Project successfully created.',
        data: { code: project.code }}).send();
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Patch('/update/:code')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), ProjectGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a project', description: 'Update an existing project using its unique code. Requires project ownership or admin role.' })
  @ApiBody({ schema: { type: 'object', properties: { title: { type: 'string', description: 'New title of the project', example: 'Updated Project Title' }, description: { type: 'string', description: 'New description of the project', example: 'Updated project description' } } } })
  @ApiResponse({ status: 200, description: 'Project successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Project update failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to update the project.' })
  @ApiResponse({ status: 404, description: 'Not Found. Project with the given code does not exist.' })
  async update(
    @Res() res: Response,
    @Param('code') code: string,
    @Body(new ValidationPipe({ transform: true })) body: any
  ) {
    try {
      const { title, description } = body;
      const updated = await this.projectService.updateByCode(code, { title, description });

      if (updated) {
        return res.status(HttpStatus.OK).json({
          message: 'Project successfully updated.',
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Project not found or update failed.',
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while updating the project.',
        error: error.message,
      });
    }
  }

  @Post('/complete/:id')
  @UseGuards(AuthGuard('jwt'), ProjectGuard)
  @ApiOperation({ summary: 'Complete a project', description: 'Mark a project as completed. Requires project ownership or admin role.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the project to complete' })
  @ApiResponse({ status: 200, description: 'Project successfully completed.', type: Project })
  @ApiResponse({ status: 400, description: 'Bad Request. Project completion failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to complete the project.' })
  async completeProject(@Res() res: Response, @Param('id', new ParseIntPipe()) id: number) {
    const completed = await this.projectService.complete(id);
    if (completed) {
      const updatedLastEntity = await this.projectService.findById(id);

      res.status(HttpStatus.OK).send(updatedLastEntity);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ProjectGuard)
  @ApiOperation({ summary: 'Delete a project', description: 'Delete a project by its ID. Requires project ownership or admin role.' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the project to delete' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted.', type: Project })
  @ApiResponse({ status: 400, description: 'Bad Request. Project deletion failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission to delete the project.' })
  async delete(@Res() res: Response, @Param('id', new ParseIntPipe()) id: number) {
    const deleted = await this.projectService.delete(id);
    if (deleted) {
      res.status(HttpStatus.OK).send(deleted);
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

}
