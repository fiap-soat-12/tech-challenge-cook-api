import { DatabaseConnection } from '@domain/repositories/database-connection';
import { PgAdapter } from '@infrastructure/database/pg-adapter';
import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'DatabaseConnection',
      useFactory: (): DatabaseConnection => {
        const dbType = process.env.DB_TYPE || 'postgres';

        switch (dbType) {
          case 'postgres':
            return PgAdapter.getInstance();
          default:
            throw new Error(`Unsupported DB_TYPE: ${dbType}`);
        }
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
