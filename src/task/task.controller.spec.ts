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

describe('TaskController'