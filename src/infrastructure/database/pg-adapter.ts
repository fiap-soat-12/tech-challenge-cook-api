import { PageCollection } from '@domain/models/page-collection';
import { DatabaseConnection } from '@domain/repositories/database-connection';
import { Pool } from 'pg';

export class PgAdapter implements DatabaseConnection {
  private static instance: PgAdapter;
  private readonly pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'techchallenge',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });
  }

  static getInstance(): PgAdapter {
    if (!PgAdapter.instance) {
      PgAdapter.instance = new PgAdapter();
    }
    return PgAdapter.instance;
  }

  getPool(): Pool {
    return this.pool;
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.log('Connected to PostgreSQL');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL', error);
      throw new Error('Database connection failed');
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log('Disconnected from PostgreSQL');
    } catch (error) {
      console.error('Error while disconnecting from PostgreSQL', error);
      throw new Error('Database disconnection failed');
    }
  }

  async query<T, P extends any[] = any[]>(
    statement: string,
    params?: P,
  ): Promise<T> {
    try {
      console.log(`Executing Query: ${statement}`);
      console.log(`With Parameters: ${JSON.stringify(params)}`);

      const result = await this.pool.query<T, P>(statement, params);

      if (!result?.rowCount) {
        return null;
      }

      return result.rows;
    } catch (error) {
      console.error('Database query failed:', { statement, params, error });
      throw new Error('Failed to execute query');
    }
  }

  async queryPaginate<T = any, P extends any[] = any[]>({
    statement,
    params,
    page,
    size,
  }: {
    statement: string;
    params: P;
    page: number;
    size: number;
  }): Promise<PageCollection<T>> {
    try {
      console.log(`Executing Query Paginated: ${statement}`);
      console.log(
        `With Parameters: ${JSON.stringify(params)}, page: ${page}, size: ${size}`,
      );

      const offset = page * size;

      const dataQuery = `${statement} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      const databaseResponse = await this.pool.query<T>(dataQuery, [
        ...params,
        size,
        offset,
      ]);

      if (!databaseResponse || !databaseResponse?.rowCount) {
        return new PageCollection();
      }

      const countQuery = `SELECT COUNT(*) FROM (${statement}) AS count_query`;
      const countResult = await this.pool.query<{ count: number }>(
        countQuery,
        params,
      );

      const totalElements = parseInt(countResult.rows[0]?.count || '0', 10);

      return new PageCollection({
        content: databaseResponse.rows,
        totalElements: totalElements,
        currentPage: page,
        pageSize: size,
      });
    } catch (error) {
      console.error('Database query paginated failed:', {
        statement,
        params,
        error,
      });
      throw new Error('Failed to execute query paginated');
    }
  }

  async close(): Promise<void> {
    await this.disconnect();
  }
}
