import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

/**
 * Business logic layer for note management.
 * All database access goes through the TypeORM repository injected in the constructor.
 */
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  /**
   * Create a new note.
   * Explicitly constructs the object before saving to avoid persisting
   * unexpected fields that might come from the raw request body.
   */
  async createNote(noteData: Partial<Note>): Promise<Note> {
    if (!noteData.title || !noteData.content || !noteData.date) {
      throw new Error('Missing required fields: title, content, or date');
    }
    const note: Partial<Note> = {
      title: noteData.title,
      content: noteData.content,
      date: noteData.date,
      category: noteData.category ?? undefined,
      isImportant: noteData.isImportant ?? false,
      isActive: noteData.isActive ?? true,
    };
    return this.noteRepository.save(note);
  }

  /**
   * Return notes, optionally filtered to a single calendar day.
   * GET /notes           → all notes
   * GET /notes?date=...  → notes for that YYYY-MM-DD date only
   */
  async findAllNotes(date?: string): Promise<Note[]> {
    if (date) {
      return this.noteRepository.find({ where: { date } });
    }
    return this.noteRepository.find();
  }

  /** Find one note by primary key; returns null when not found */
  async findNoteById(id: number): Promise<Note | null> {
    return this.noteRepository.findOneBy({ id });
  }

  /**
   * Partial update - only fields explicitly present in noteData are written.
   * This prevents a PUT from accidentally clearing optional columns that the
   * caller omitted from the payload.
   */
  async updateNote(id: number, noteData: Partial<Note>): Promise<Note> {
    const updateFields: Partial<Note> = {};
    if (noteData.title !== undefined) updateFields.title = no