import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /** Returns basic health information about the running process */
  getHealth(): { status: string; timestamp: string; uptime: number } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };
  }
}
