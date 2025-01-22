import { Logger } from '@application/interfaces/logger.interface';

export function createWithLogger<T>(
  providerClass: new (...args: any[]) => T,
  dependencies: any[],
  logger: Logger,
): T {
  logger.setContext(providerClass.name); // Define o contexto dinamicamente
  return new providerClass(...dependencies, logger); // Cria a instância com logger configurado
}
