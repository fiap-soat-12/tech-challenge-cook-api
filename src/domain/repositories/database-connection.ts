import { PageCollection } from '@domain/models/page-collection';

export interface DatabaseConnection {
  /**
   * Executa uma consulta SQL no banco de dados.
   * @param statement A string SQL a ser executada.
   * @param params Os parâmetros da consulta (opcional).
   * @returns Um objeto `QueryResult` contendo as linhas e os metadados retornados pela consulta.
   */
  query<T = any, P extends any[] = any[]>(
    statement: string,
    params?: P,
  ): Promise<T[]>;

  queryPaginate<T = any, P extends any[] = any[]>(options: {
    statement: string;
    params?: P;
    page: number;
    size: number;
  }): Promise<PageCollection<T>>;

  /**
   * Estabelece uma conexão com o banco de dados.
   */
  connect(): Promise<void>;

  /**
   * Encerra todas as conexões abertas e encerra o pool.
   */
  disconnect(): Promise<void>;

  /**
   * Retorna o pool de conexões usado internamente.
   * @returns A instância do pool de conexões.
   */
  getPool(): any;
}
