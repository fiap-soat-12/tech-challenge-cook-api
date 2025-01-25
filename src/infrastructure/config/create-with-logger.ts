import { Logger } from '@application/interfaces/logger.interface';

export function createWithLogger<T>(
  providerClass: new (...args: any[]) => T,
  dependencies: any[],
  logger: Logger,
): T {
  logger.setContext(providerClass.name);
  return new providerClass(...dependencies, logger);
}
