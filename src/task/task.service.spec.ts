import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task } from './task.entity';

// Minimal mock that satisfies the Repository interface for the methods we call
const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.