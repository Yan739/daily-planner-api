import { IsString, IsOptional, IsBoolean, IsDateString, IsInt, Min, Max } from 'class-validator';

/**
 * DTOs (Data Transfer Objects) act as the validation boundary for incoming HTTP bodies.
 * class-validator decorators run automatically when ValidationPipe is enabled globally.
 *
 * CreateGoalDto - all fields required for a new goal.
 * UpdateGoalDto - every field optional so the client can send partial patches.
 */

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** Expected format: YYYY-MM-DD */
  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  isAchieved?: boolean;

  /** Importance level: 1 (low) to 5 (critical) - enforced by