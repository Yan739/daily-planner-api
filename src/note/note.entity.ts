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

  /** ISO date string (YYYY-MM-DD) — ties the note to a calendar day */
  @Column({ type: 'date' })
  date: string;

  /** Optional user-defined tag (e.g. 'work', 'personal', 'ideas') */
  @Column({ nullable: true })
  category: string;

  /** Flags notes the user wants to highlight or pin */
  @Column({ default: false })
  isImportant: boolean;

  /** Soft-delete flag — inactive notes are hidden in the UI but kept in the DB */
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
