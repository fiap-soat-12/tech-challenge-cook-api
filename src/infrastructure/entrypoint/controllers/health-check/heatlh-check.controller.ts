import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica o status da API' })
  @ApiOkResponse({
    description: 'A API está saudável',
    schema: {
      example: {
        status: 'ok',
        info: {
          'nestjs-docs': { status: 'up' },
        },
        error: {},
        details: {
          'nestjs-docs': { status: 'up' },
        },
      },
    },
  })
  check() {
    return this.health.check([
      async () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
