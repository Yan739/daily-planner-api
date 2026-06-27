import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

/**
 * REST controller for the /schedules resource.
 * Handles HTTP routing and delegates all business logic to ScheduleService.
 */
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /** POST /schedules - create a new time-blocked entry */
  @Post()
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  /**
   * GET /schedules          - return all schedule entries across all dates
   * GET /schedules?date=YYYY-MM-DD - return only entries for that day
   */
  @Get()
  async findAllSchedules(@Query('date') date?: string): Promise<Schedule[]> {
    return this.scheduleService.findAllSchedules(date);
  }

  /** GET /schedules/:id - return a single entry; 404 if not found */
  @Get(':id')
  async findScheduleById(@Param('id', ParseIntPipe) id: number): Promise<Schedule | null> {
    const schedule = await this.scheduleService.findScheduleById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not 