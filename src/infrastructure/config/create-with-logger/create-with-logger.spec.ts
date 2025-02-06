import { Logger } from '@application/interfaces/logger.interface';
import { createWithLogger } from './create-with-logger';

class MockClass {
  dependency: any;
  logger: Logger;

  constructor(dependency: any, logger: Logger) {
    this.dependency = dependency;
    this.logger = logger;
  }
}

describe('createWithLogger', () => {
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
  });

  it('should call the logger with the correct context', () => {
    createWithLogger(MockClass, [], mockLogger);

    // Verifica se o logger.setContext foi chamado com o nome da classe
    expect(mockLogger.setContext).toHaveBeenCalledTimes(1);
    expect(mockLogger.setContext).toHaveBeenCalledWith('MockClass');
  });

  it('should pass the dependencies to the provider class constructor', () => {
    const mockDependency = { key: 'value' };
    const instance = createWithLogger(MockClass, [mockDependency], mockLogger);

    // Verifica se as dependências foram passadas corretamente
    expect((instance as any).dependency).toBe(mockDependency);
  });
});
