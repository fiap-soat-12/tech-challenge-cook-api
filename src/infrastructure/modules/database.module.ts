import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { DatabaseInitService } from '@infrastructure/database/pg-database-init';
import { DatabaseAcceptEnum } from '@infrastructure/enums/database-accepted.enum';
import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { Logger } from '@application/interfaces/logger.interface';
import { PgAdapter } from '@infrastructure/database/pg.adapter';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [
    DatabaseInitService,
    {
      provide: 'DatabaseConnection',
      useFactory: (logger: Logger): DatabaseConnection => {
        const dbType = process.env.DB_TYPE || 'postgresql';

        logger.log(`Database type: ${dbType}`);

        if (dbType === DatabaseAcceptEnum.POSTGRESQL) {
          return PgAdapter.getInstance(logger);
        }
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      },
      inject: ['Logger'],
    },
  ],
  exports: ['DatabaseConnection'],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DatabaseConnection,
    @Inject('Logger') private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.db.connect();
    this.logger.log('Database connection initialized');
  }
}
