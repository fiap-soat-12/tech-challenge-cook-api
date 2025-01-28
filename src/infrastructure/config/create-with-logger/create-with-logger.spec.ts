import { Logger } from '@application/interfaces/logger.interface';
import { createWithLogger } from './create-with-logger';

class MockClass {
  constructor(
    public dependency: any,
    public logger: Logger,
  ) {}
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

  it('should create an instance of the provider class with the logger and dependencies', () => {
    const mockDependency = {};
    const instance = createWithLogger(MockClass, [mockDependency], mockLogger);

    // Verifica se a instância foi criada corretamente
    expect(instance).toBeInstanceOf(MockClass);
    expect(instance.logger).toBe(mockLogger);

    // Verifica se o logger foi configurado com o contexto da classe
    expect(mockLogger.setContext).toHaveBeenCalledWith(MockClass.name);
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
