import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Logger } from '@application/interfaces/logger.interface';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DatabaseConnection,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.runMigrations();
      this.logger.log('Todas as migrações foram executadas com sucesso!');
    } catch (error) {
      this.logger.error('Erro ao executar migrações:', error);
      throw error;
    }
  }

  private async runMigrations(): Promise<void> {
    const migrations = [
      { version: 'V1', file: 'V1__CREATE_COOK_ORDER_TABLE.sql' },
      { version: 'V2', file: 'V2__CREATE_PRODUCT_TABLE.sql' },
      { version: 'V3', file: 'V3__ORDER_PRODUCT_TABLE.sql' },
    ];

    for (const migration of migrations) {
      try {
        const sql = readFileSync(
          path.join('src/resources/db/migration', migration.file),
          'utf8',
        );
        await this.db.query(sql);
        this.logger.log(`Migração ${migration.version} executada com sucesso!`);
      } catch (error) {
        this.logger.error(
          `Falha ao executar migração ${migration.version}:`,
          error,
        );
        throw error; // ✅ Se falhar, lançamos erro e evitamos execução parcial.
      }
    }
  }
}
