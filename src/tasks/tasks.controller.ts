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
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

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

  // @Patch('/:id/status')
  // updateStatus(
  //   @Param() params: FindOneParams,
  //   @Body() body: UpdateTaskDto,
  // ): ITask {
  //   const task = this.findOneOrFail(params.id);
  //   task.status = body.status;

  //   return task;
  // }

  @Patch('/:id')
  updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): ITask {
    console.log('sth bad');
    const task = this.findOneOrFail(params.id);

    try {
      return this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException();
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param() params: FindOneParams): void {
    const task = this.findOneOrFail(params.id);
    this.tasksService.deleteTask(task);
  }

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) throw new NotFoundException();

    return task;
  }
}
