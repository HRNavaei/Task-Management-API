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
import { Task } from './task.entity';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  async findAll(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Get('/:id')
  async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
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
  async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);

    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      [WrongTaskStatusException].forEach((error1) => {
        if (error instanceof error1) throw new BadRequestException();
      });

      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) throw new NotFoundException();

    return task;
  }
}
