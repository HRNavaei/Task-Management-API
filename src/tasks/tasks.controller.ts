import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { UpdateTaskStatusDto } from './update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  findOne(@Param() params: FindOneParams): ITask {
    return this.findOneOrFail(params.id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.create(createTaskDto);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param() params: FindOneParams,
    @Body() body: UpdateTaskStatusDto,
  ): ITask {
    const task = this.findOneOrFail(params.id);
    task.status = body.status;

    return task;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param() params: FindOneParams): void {
    this.tasksService.deleteTask(params.id);
  }

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) throw new NotFoundException();

    return task;
  }
}
