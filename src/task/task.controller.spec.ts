import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';

// Stub that covers every TaskService method used by the controller
const mockTaskService = {
  createTask: jest.fn(),
  findAllTasks: jest.fn(),
  findTaskById: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('delegates to TaskService and returns the created task', async () => {
      const dto = { title: 'Buy groceries', date: '2026-06-27' };
      const task = { id: 1, ...dto } as Task;
      mockTaskService.createTask.mockResolvedValue(task);

      const result = await controller.createTask(dto as any);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(dto);
      expect(result).toEqual(task);
    });
  });

  describe('findTaskById', () => {
    it('returns the task when it exists', async () => {
      const task = { id: 1, title: 'Buy groceries' } as Task;
      mockTaskService.findTaskById.mockResolvedValue(task);

      const result = await controller.findTaskById(1);

      expect(result).toEqual(task);
    });

    it('throws NotFoundException when the task does not exist', async () => {
      mockTaskService.findTaskById.mockResolvedValue(null);

      await expect(controller.findTaskById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('delegates to TaskService.deleteTask', async () => {
      mockTaskService.deleteTask.mockResolvedValue(undefined);

      await controller.deleteTask(1);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
