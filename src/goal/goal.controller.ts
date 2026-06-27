import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { GoalService } from './goal.service';
import { Goal } from './goal.entity';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

/**
 * REST controller for the /goals resource.
 * Handles HTTP routing and delegates all business logic to GoalService.
 */
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  /** POST /goals - create a new daily goal */
  @Post()
  async createGoal(@Body() createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalService.createGoal(createGoalDto);
  }

  /**
   * GET /goals          - return all goals across all dates
   * GET /goals?date=YYYY-MM-DD - return only goals for that day
   */
  @Get()
  async findAllGoals(@Query('date') date?: string): Promise<Goal[]> {
    return this.goalService.findAllGoals(date);
  }

  /** GET /goals/:id - return a single goal; 404 if not found */
  @Get(':id')
  async findGoalById(@Param('id', ParseIntPipe) id: number): Promise<Goal | null> {
    const goal = await this.goalService.findGoalById(id);
    if (!goal) {
      throw new NotFoundException(`Goal with