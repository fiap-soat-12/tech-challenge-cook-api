import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@application/interfaces/logger.interface';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { readFileSync } from 'fs';
import * as path from 'path';
import { DatabaseInitService } from './pg-database-init';

jest.mock('fs');
jest.mock('path');

describe('DatabaseInitService', () => {
  let service: DatabaseInitService;
  let mockDb: DatabaseConnection;
  let mockLogger: Logger;

  beforeEach(async () => {
    mockDb = {
      query: jest.fn(),
      queryPaginate: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      getPool: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setContext: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseInitService,
        { provide: 'DatabaseConnection', useValue: mockDb },
        { provide: 'Logger', useValue: mockLogger },
      ],
    }).compile();

    service = module.get<DatabaseInitService>(DatabaseInitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call runMigrations on module init', async () => {
    jest.spyOn(service as any, 'runMigrations').mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(service['runMigrations']).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Todas as migrações foram executadas com sucesso!',
    );
  });

  it('should execute all migrations successfully', async () => {
    const mockSql = 'CREATE TABLE TEST;';
    (readFileSync as jest.Mock).mockReturnValue(mockSql);
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

    await service['runMigrations']();

    expect(mockDb.query).toHaveBeenCalledTimes(3);
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Migração V1 executada com sucesso!',
    );
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Migração V2 executada com sucesso!',
    );
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Migração V3 executada com sucesso!',
    );
  });

  it('should log an error and throw if a migration fails', async () => {
    const error = new Error('DB Error');
    (readFileSync as jest.Mock).mockReturnValue('INVALID SQL;');
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    jest.spyOn(mockDb, 'query').mockRejectedValueOnce(error);

    await expect(service['runMigrations']()).rejects.toThrow(error);
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Falha ao executar migração V1:',
      error,
    );
  });

  it('should log an error and throw if onModuleInit fails', async () => {
    const error = new Error('Migration Failure');
    jest.spyOn(service as any, 'runMigrations').mockRejectedValue(error);

    await expect(service.onModuleInit()).rejects.toThrow(error);
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Erro ao executar migrações:',
      error,
    );
  });
});
