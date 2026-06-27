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
  delete: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TaskService', () => {
  let service: TaskService;
  let repo: MockRepository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repo = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- createTask ---

  describe('createTask', () => {
    it('saves and returns the new task when valid data is provided', async () => {
      const input = { title: 'Buy groceries', date: '2026-06-27' };
      const saved: Task = { id: 1, ...input, status: 'pending', isCompleted: false } as Task;

      repo.save!.mockResolvedValue(saved);

      const result = await service.createTask(input);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Buy groceries', date: '2026-06-27', status: 'pending', isCompleted: false }),
      );
      expect(result).toEqual(saved);
    });

    it('throws when title is missing', async () => {
      await expect(service.createTask({ date: '2026-06-27' })).rejects.toThrow(
        'Missing required fields: title or date',
      );
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('throws when date is missing', async () => {
      await expect(service.createTask({ title: 'Buy groceries' })).rejects.toThrow(
        'Missing required fields: title or date',
      );
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  // --- findAllTasks ---

  describe('findAllTasks', () => {
    it('returns all tasks from the repository', async () => {
      const tasks = [{ id: 1, title: 'Task A' }, { id: 2, title: 'Task B' }] as Task[];
      repo.find!.mockResolvedValue(tasks);

      const result = await service.findAllTasks();

      expect(result).toEqual(tasks);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  // --- findTaskById ---

  describe('findTaskById', () => {
    it('returns the task when found', async () => {
      const task = { id: 1, title: 'Buy groceries' } as Task;
      repo.findOne!.mockResolvedValue(task);

      const result = await service.findTaskById(1);

      expect(result).toEqual(task);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('returns null when the task does not exist', async () => {
      repo.findOne!.mockResolvedValue(null);

      const result = await service.findTaskById(999);

      expect(result).toBeNull();
    });
  });

  // --- updateTask ---

  describe('updateTask', () => {
    it('updates only provided fields and returns the refreshed task', async () => {
      const updated = { id: 1, title: 'Updated title', date: '2026-06-27', isCompleted: true } as Task;
      repo.update!.mockResolvedValue(undefined);
      repo.findOneBy!.mockResolvedValue(updated);

      const result = await service.updateTask(1, { title: 'Updated title', isCompleted: true });

      expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated title', isCompleted: true });
      expect(result).toEqual(updated);
    });

    it('throws when the task is not found after update', async () => {
      repo.update!.mockResolvedValue(undefined);
      repo.findOneBy!.mockResolvedValue(null);

      await expect(service.updateTask(999, { title: 'Ghost' })).rejects.toThrow(
        'Task with id 999 not found',
      );
    });
  });

  // --- deleteTask ---

  describe('deleteTask', () => {
    it('calls repository.delete with the correct id', async () => {
      repo.delete!.mockResolvedValue(undefined);

      await service.deleteTask(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
