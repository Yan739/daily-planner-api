import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents a daily goal — a higher-level intention that the user
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

  /** ISO date string (YYYY-MM-DD) — ties the goal to a specific day */
  @Column({ type: 'date' })
  date: string;

  /** Flipped to true when the user marks the goal as done */
  @Column({ default: false })
  isAchieved: boolean;

  /** User-defined importance level: 1 (low) to 5 (critical) */
  @Column({ default: 1 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
