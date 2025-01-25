import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { PgAdapter } from '@infrastructure/database/pg-adapter';
import { DatabaseAcceptEnum } from '@infrastructure/enums/database-accepted.enum';
import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'DatabaseConnection',
      useFactory: (): DatabaseConnection => {
        const dbType = process.env.DB_TYPE || 'postgresql';

        if (dbType === DatabaseAcceptEnum.POSTGRESQL) {
          return PgAdapter.getInstance();
        }
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
      },
    },
  ],
  exports: ['DatabaseConnection'],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @Inject('DatabaseConnection') private readonly db: DatabaseConnection,
  ) {}

  async onModuleInit() {
    await this.db.connect();
    console.log('Database connection initialized');
  }
}
