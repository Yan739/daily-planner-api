import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

/**
 * Business logic layer for schedule (time-block) management.
 * All database access goes through the TypeORM repository injected in the constructor.
 */
@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  /**
   * Create a new schedule entry.
   * Explicitly constructs the object before saving to avoid persisting
   * unexpected fields that might come from the raw request body.
   */
  async createSchedule(scheduleData: Partial<Schedule>): Promise<Schedule> {
    if (!scheduleData.title || !scheduleData.date || !scheduleData.startTime) {
      throw new Error('Missing required fields: title, date, or startTime');
    }
    const schedule: Partial<Schedule> = {
      title: scheduleData.title,
      description: scheduleData.description ?? undefined,
      date: scheduleData.date,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime ?? undefined,
      status: scheduleData.status ?? 'scheduled',
      location: scheduleData.location ?? undefined,
    };
    return this.scheduleRepository.save(schedule);
  }

  /**
   * Return schedule entries, optionally filtered to a single calendar day.
   * GET /schedules           → all entries
   * GET /schedules?date=...  → entries for that YYYY-MM-DD date only
   */
  async findAllSchedules(date?: string): Promise<Schedule[]> {
    if (date) {
      return this.scheduleRepository.find({ where: { date } });
    }
    return this.scheduleRepository.find();
  }

  /** Find one entry by primary key; returns null when not found */
  async findScheduleById(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOneBy({ id });
  }

  /**
   * Partial update - only fields explicitly present in scheduleData are written.
   * This prevents a PUT from accidentally clearing optional columns that the
   * caller omitted from the payload.
   */
  async updateSchedule(id: number, scheduleData: Partial<Schedule>): Promise<Schedule> {
    const updateFields: Partial<Schedule> = {};
    if (scheduleData.title !== undefined) updateFields.title = scheduleData.title;
    if (scheduleData.description !== undefined) updateFields.description = scheduleData.description;
    if (scheduleData.date !== undefined) updateFields.date = scheduleData.date;
    if (scheduleData.startTime !== undefined) updateFields.startTime = scheduleData.startTime;
  