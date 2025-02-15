import { Logger } from '@application/interfaces/logger.interface';
import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { PageCollection } from '@domain/models/page-collection';
import { Pool } from 'pg';

interface FieldDef {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number; // OID do tipo de dado (ex.: 23 para integer, 1043 para varchar)
  dataTypeSize: number; // Tamanho do tipo de dado (ex.: -1 para varchar/text, 4 para int4)
  dataTypeModifier: number; // Modificador do tipo (ex.: precisão de campos numéricos)
  format: string; // Formato dos dados retornados (ex.: "text", "binary")
}

interface QueryResult<T = any> {
  command: string; // O comando SQL executado, ex.: "SELECT", "INSERT"
  rowCount: number; // Número de linhas afetadas
  oid: number; // ID do objeto (para comandos de inserção)
  rows: T[]; // Os dados retornados na consulta
  fields: FieldDef[]; // Metadados das colunas
}

export class PgAdapter implements DatabaseConnection {
  private static instance: PgAdapter;
  private readonly pool: Pool;

  private constructor(private readonly logger: Logger) {
    const dbType = process.env.DB_TYPE || 'postgresql';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbHost = process.env.DB_URL || 'localhost';
    const dbName = process.env.DB_NAME || 'tc_cook_db';
    const dbPassword = process.env.DB_PASSWORD || 'password';

    this.logger.log(
      'PgAdapter connectionString',
      `${dbType}://${dbUser}:${dbPassword}@${dbHost}/${dbName}`,
    );

    this.pool = new Pool({
      connectionString: `${dbType}://${dbUser}:${dbPassword}@${dbHost}/${dbName}`,
    });
  }

  static getInstance(logger: Logger): PgAdapter {
    if (!PgAdapter.instance) {
      PgAdapter.instance = new PgAdapter(logger);
    }
    return PgAdapter.instance;
  }

  getPool(): Pool {
    return this.pool;
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      this.logger.log('Connected to PostgreSQL');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL', error);
      throw new Error('Database connection failed');
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.log('Disconnected from PostgreSQL');
    } catch (error) {
      this.logger.error('Error while disconnecting from PostgreSQL', error);
      throw new Error('Database disconnection failed');
    }
  }

  async query<T, P extends any[] = any[]>(
    statement: string,
    params?: P,
  ): Promise<T[]> {
    try {
      this.logger.log(`Executing Query: ${statement}`);
      this.logger.log(`With Parameters: ${JSON.stringify(params)}`);

      const result: QueryResult<T> = await this.pool.query<T, P>(
        statement,
        params,
      );

      if (!result?.rowCount) {
        return null;
      }

      return result.rows;
    } catch (error) {
      if (error.code === '23503') {
        this.logger.error(
          'Database query failed, O item referenciado não existe!:',
          JSON.stringify({ statement, params, error }),
        );
        throw new Error(
          'Database query failed, O item referenciado não existe!',
        );
      }
      this.logger.error(
        'Database query failed:',
        JSON.stringify({ statement, params, error }),
      );
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
      this.logger.log(`Executing Query Paginated: ${statement}`);
      this.logger.log(
        `With Parameters: ${JSON.stringify(params)}, page: ${page}, size: ${size}`,
      );

      const offset = page * size;

      const dataQuery = `${statement} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      const databaseResponse: QueryResult<T> = await this.pool.query<T>(
        dataQuery,
        [...params, size, offset],
      );

      if (!databaseResponse?.rowCount) {
        return new PageCollection();
      }

      const countQuery = `SELECT COUNT(*) FROM (${statement}) AS count_query`;
      const countResult: QueryResult<{ count: string }> =
        await this.pool.query<{
          count: number;
        }>(countQuery, params);

      const totalElements = parseInt(countResult.rows[0]?.count || '0', 10);

      return new PageCollection({
        content: databaseResponse.rows,
        totalElements: totalElements,
        currentPage: page,
        pageSize: size,
      });
    } catch (error) {
      this.logger.error(
        `Database query paginated failed:, ${JSON.stringify({
          statement,
          params,
          error,
        })}`,
      );
      throw new Error('Failed to execute query paginated');
    }
  }

  async close(): Promise<void> {
    await this.disconnect();
  }
}
