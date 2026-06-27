import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents a daily goal - a higher-level intention that the user
 * wants to accomplish on a given day, distinct from granular tasks.
 */
@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  /** ISO date string (YYYY-MM-DD) - ties the goal to a specific day */
  @Column({ type: 'date' })
  date: string;