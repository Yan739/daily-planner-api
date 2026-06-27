import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

/**
 * DTOs (Data Transfer Objects) act as the validation boundary for incoming HTTP bodies.
 * class-validator decorators run automatically when ValidationPipe is enabled globally.
 *
 * CreateTaskDto - all fields required for a new task.
 * UpdateTaskDto - every field optional so the client can send partial patches.
 */

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** Expected format: YYYY-MM-DD */
  @IsDateString()
  date: string;

  /** Expected format: HH:mm (24-hour) */
  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isComplete