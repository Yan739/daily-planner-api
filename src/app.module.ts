import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GoalModule } from './goal/goal.module';
import { ScheduleModule } from './schedule/schedule.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    // Make process.env variables available application-wide without re-importing ConfigModule
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection - all values come from the .env file
    // autoLoadEntities: each feature module registers its own entity, no manual list needed here
    // synchronize: true is convenient in development; disable it in production and use migrations instead
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      us