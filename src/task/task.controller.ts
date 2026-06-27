import { Body, Controller, Delete, Get, Param, Post, Put, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

/**
 * REST controller for the /tasks resource.
 * Handles HTTP routing and delegates all business logic to TaskService.
 */
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** POST /tasks - create a new task for a given date */
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  /**
   * GET /tasks          - return all tasks across all dates
   * GET /tasks?date=YYYY-MM-DD - return only tasks for that day
   */
  @Get()
  async findAllTasks(@Query('date') date?: string): Promise<Task[]> {
    return this.taskService.findAllTasks(date);
  }

  /** GET /tasks/:id - return a single task; 404 if not found */
  @Get(':id')
  async findTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task | null> {
    const task = await this.taskService.findTaskById(id);
    if (!task) {
      throw new NotFoundException