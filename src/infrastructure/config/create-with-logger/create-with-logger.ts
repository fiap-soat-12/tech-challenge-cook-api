import { Logger } from '@application/interfaces/logger.interface';

const loggerFactory = (context: string, logger: Logger): Logger => {
  const contextualLogger = Object.create(logger);
  contextualLogger.setContext(context);
  return contextualLogger;
};

export function createWithLogger<T>(
  providerClass: new (...args: any[]) => T,
  dependencies: any[],
  logger: Logger,
): T {
  return new providerClass(
    ...dependencies,
    loggerFactory(providerClass.name, logger),
  );
}
