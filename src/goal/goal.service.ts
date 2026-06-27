import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';

/**
 * Business logic layer for goal management.
 * All database access goes through the TypeORM repository injected in the constructor.
 */
@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  /**
   * Create a new daily goal.
   * Explicitly constructs the object before saving to avoid persisting
   * unexpected fields that might come from the raw request body.
   */
  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    if (!goalData.title || !goalData.date) {
      throw new Error('Missing required fields: title or date');
    }
    const goal: Partial<Goal> = {
      title: goalData.title,
      description: goalData.description ?? undefined,
      date: goalData.date,
      isAchieved: goalData.isAchieved ?? false,
      priority: goalData.priority ?? 1,
    };
    return this.goalRepository.save(goal);
  }

  /**
   * Return goals, optionally filtered to a single calendar day.
   * GET /goals           → all goals
   * GET /goals?date=...  → goals for that YYYY-MM-DD date only
   */
  async findAllGoals(date?: string): Promise<Goal[]> {
    if (date) {
      return this.goalRepository.find({ where: { date } });
    }
    return this.goalRepository.find();
  }

  /** Find one goal by primary key; returns null when not found */
  async findGoalById(id: number): Promise<Goal | null> {
    return this.goalRepository.findOneBy({ id });
  }

  /**
   * Partial update — only fields explicitly present in goalData are written.
   * This prevents a PUT from accidentally clearing optional columns that the
   * caller omitted from the payload.
   */
  async updateGoal(id: number, goalData: Partial<Goal>): Promise<Goal> {
    const updateFields: Partial<Goal> = {};
    if (goalData.title !== undefined) updateFields.title = goalData.title;
    if (goalData.description !== undefined) updateFields.description = goalData.description;
    if (goalData.date !== undefined) updateFields.date = goalData.date;
    if (goalData.isAchieved !== undefined) updateFields.isAchieved = goalData.isAchieved;
    if (goalData.priority !== undefined) updateFields.priority = goalData.priority;

    await this.goalRepository.update(id, updateFields);

    // Re-fetch to return the full, up-to-date record (update() does not return rows)
    const updatedGoal = await this.goalRepository.findOneBy({ id });
    if (!updatedGoal) {
      throw new Error(`Goal with id ${id} not found`);
    }
    return updatedGoal;
  }

  /** Hard-delete a goal by primary key */
  async deleteGoal(id: number): Promise<void> {
    await this.goalRepository.delete(id);
  }
}
