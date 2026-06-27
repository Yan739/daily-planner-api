import { IsString, IsOptional, IsDateString } from 'class-validator';

/**
 * DTOs (Data Transfer Objects) act as the validation boundary for incoming HTTP bodies.
 * class-validator decorators run automatically when ValidationPipe is enabled globally.
 *
 * CreateScheduleDto — all fields required for a new time block.
 * UpdateScheduleDto — every field optional so the client can send partial patches.
 */

export class CreateScheduleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** Expected format: YYYY-MM-DD */
  @IsDateString()
  date: string;

  /** Expected format: HH:mm (24-hour) — required to place the block in the hourly view */
  @IsString()
  startTime: string;

  /** Expected format: HH:mm (24-hour) — optional for open-ended blocks */
  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
