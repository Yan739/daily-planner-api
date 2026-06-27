import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET /health
   * Lightweight liveness probe — useful for Docker health checks and monitoring tools.
   * Returns the process uptime (seconds) so you can verify the server restarted cleanly.
   */
  @Get('health')
  getHealth(): { status: string; timestamp: string; uptime: number } {
    return this.appService.getHealth();
  }
}
