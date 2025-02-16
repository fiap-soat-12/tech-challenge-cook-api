import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthCheckController } from './heatlh-check.controller';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call health check and return status', async () => {
    const healthCheckResult = {
      status: 'ok',
      info: { 'nestjs-docs': { status: 'up' } },
      error: {},
      details: { 'nestjs-docs': { status: 'up' } },
    };

    (healthCheckService.check as jest.Mock).mockResolvedValue(
      healthCheckResult,
    );
    (httpHealthIndicator.pingCheck as jest.Mock).mockResolvedValue({
      'nestjs-docs': { status: 'up' },
    });

    const result = await controller.check();
    expect(result).toEqual(healthCheckResult);
    expect(healthCheckService.check).toHaveBeenCalledWith([
      expect.any(Function),
    ]);
  });

  it('should handle errors in pingCheck', async () => {
    const error = new Error('Network error');
    (healthCheckService.check as jest.Mock).mockRejectedValue(error);

    await expect(controller.check()).rejects.toThrow(error);
  });
});
