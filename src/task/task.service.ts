import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

/**
 * Business logic layer for task management.
 * All database access goes through the TypeORM repository injected in the constructor.
 */
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  /**
   * Create a new task.
   * Explicitly constructs the object before saving to avoid persisting
   * unexpected fields that might come from the raw request body.
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    if (!taskData.title || !taskData.date) {
      throw new Error('Missing required fields: title or date');
    }
    const task: Partial<Task> = {
      title: taskData.title,
      description: taskData.description ?? undefined,
      date: taskData.date,
      time: taskData.time ?? undefined,
      status: taskData.status ?? 'pending',
      isCompleted: taskData.isCompleted ?? false,
    };
    return this.taskRepository.save(task);
  }

  /**
   * Return tasks, optionally filtered to a single calendar day.
   * GET /tasks           → all tasks
   * GET /tasks?date=...  → tasks for that YYYY-MM-DD date only
   */
  async findAllTasks(date?: string): Promise<Task[]> {
    if (date) {
      return this.taskRepository.find({ where: { date } });
    }
    return this.taskRepository.find();
  }

  /** Find one task by primary key; returns null when not found */
  async findTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id } });
  }

  /**
   * Partial update — only fields explicitly present in taskData are written.
   * This prevents a PUT from accidentally clearing optional columns that the
   * caller omitted from the payload.
   */
  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    const updateFields: Partial<Task> = {};
    if (taskData.title !== undefined) updateFields.title = taskData.title;
    if (taskData.description !== undefined) updateFields.description = taskData.description;
    if (taskData.date !== undefined) updateFields.date = taskData.date;
    if (taskData.time !== undefined) updateFields.time = taskData.time;
    if (taskData.status !== undefined) updateFields.status = taskData.status;
    if (taskData.isCompleted !== undefined) updateFields.isCompleted = taskData.isCompleted;

    await this.taskRepository.update(id, updateFields);

    // Re-fetch to return the full, up-to-date record (update() does not return rows)
    const updatedTask = await this.taskRepository.findOneBy({ id });
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    return updatedTask;
  }

  /** Hard-delete a task by primary key */
  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
