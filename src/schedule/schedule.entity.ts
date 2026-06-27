import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents a time-blocked event in the hourly schedule view (06:00–21:00).
 * startTime is required; endTime is optional for open-ended blocks.
 */
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  /** ISO date string (YYYY-MM-DD) — ties the entry to a calendar day */
  @Column({ type: 'date' })
  date: string;

  /** Start of the time block (HH:mm, 24-hour) — required */
  @Column({ type: 'time' })
  startTime: string;

  /** End of the time block (HH:mm, 24-hour) — optional */
  @Column({ type: 'time', nullable: true })
  endTime: string;

  /** Workflow state: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' */
  @Column({ default: 'scheduled' })
  status: string;

  /** Optional venue or context (e.g. 'Library', 'Zoom', 'Office') */
  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
