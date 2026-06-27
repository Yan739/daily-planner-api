import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from './note.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

/**
 * REST controller for the /notes resource.
 * Handles HTTP routing and delegates all business logic to NoteService.
 */
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  /** POST /notes - create a new note for a given date */
  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.noteService.createNote(createNoteDto);
  }

  /**
   * GET /notes          - return all notes across all dates
   * GET /notes?date=YYYY-MM-DD - return only notes for that day
   */
  @Get()
  async findAllNotes(@Query('date') date?: string): Promise<Note[]> {
    return this.noteService.findAllNotes(date);
  }

  /** GET /notes/:id - return a single note; 404 if not found */
  @Get(':id')
  async findNoteById(@Param('id', ParseIntPipe) id: number): Promise<Note | null> {
    const note = await this.noteService.findNoteById(id);
    if (!note) {
      throw new NotFoundException