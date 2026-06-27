import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

/**
 * DTOs (Data Transfer Objects) act as the validation boundary for incoming HTTP bodies.
 * class-validator decorators run automatically when ValidationPipe is enabled globally.
 *
 * CreateNoteDto — all fields required for a new note.
 * UpdateNoteDto — every field optional so the client can send partial patches.
 */

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  /** Expected format: YYYY-MM-DD */
  @IsDateString()
  date: string;

  /** Optional tag to group or filter notes (e.g. 'work', 'personal') */
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;

  /** Defaults to true; set to false to soft-delete without removing the record */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
