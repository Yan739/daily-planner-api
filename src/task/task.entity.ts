import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents a to-do item for a specific day.
 * A task has a date and optional time slot, allowing it to appear
 * in either the task list or the hourly schedule view on the frontend.
 */
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  /** ISO date string (YYYY-MM-DD) used to scope the task to a calendar day */
  @Column({ type: 'date' })
  date: string;

  /** Optional tim