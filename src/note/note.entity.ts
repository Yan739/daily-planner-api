import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents a freeform note attached to a specific day.
 * content uses the MySQL TEXT type (no 255-char limit) to support
 * longer entries. isActive enables soft-delete behaviour without
 * permanently losing data.
 */
@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  /** Stored as TEXT to allow notes longer than 255 characters */
  @Column('text')
  content: string;

  /** ISO date string (YYYY-MM-