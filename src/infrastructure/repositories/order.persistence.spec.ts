import { DatabaseConnection } from '@domain/interface/database-connection.interface';
import { Logger } from '@application/interfaces/logger.interface';
import { Order } from '@domain/entities/order';
import { OrderProduct } from '@domain/entities/order-product';
import { OrderPersistenceError } from '@domain/exceptions/order-persistence.exception';
import { OrderStatusType } from '@application/types/order-status.type';
import { UUID } from '@application/types/UUID.type';
import { OrderPersistence } from './order.persistence';

// Mock das dependências
const mockConnection: jest.Mocked<DatabaseConnection> = {
  query: jest.fn(),
  queryPaginate: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  getPool: jest.fn(),
};

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
} as unknown as jest.Mocked<Logger>;

const orderPersistence = new OrderPersistence(mockConnection, mockLogger);

describe('OrderPersistence', () => {
  const mockOrderId: UUID = '1234-5678-91011';
  const mockOrderStatus: OrderStatusType = 'READY';
  const mockOrderEntity = {
    id: mockOrderId,
    sequence: 12345,
    status: mockOrderStatus,
    created_at: new Date(),
    updated_at: new Date(),
    products: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatus', () => {
    it('deve atualizar o status do pedido e retornar o pedido atualizado', async () => {
      mockConnection.query.mockResolvedValueOnce([mockOrderEntity]);
      jest
        .spyOn(orderPersistence, 'findById')
        .mockResolvedValueOnce(new Order(mockOrderEntity));

      const result = await orderPersistence.updateStatus(mockOrderId, 'READY');

      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Order);
      expect(result?.status.getValue()).toBe('READY');
    });

    it('deve retornar null quando o pedido não for encontrado', async () => {
      mockConnection.query.mockResolvedValueOnce([]);

      const result = await orderPersistence.updateStatus(mockOrderId, 'READY');

      expect(result).toBeNull();
    });

    it('deve lançar OrderPersistenceError em caso de erro no banco', async () => {
      mockConnection.query.mockRejectedValueOnce(new Error('DB Error'));

      await expect(
        orderPersistence.updateStatus(mockOrderId, 'READY'),
      ).rejects.toThrow(OrderPersistenceError);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('deve retornar um pedido válido', async () => {
      mockConnection.query.mockResolvedValueOnce([mockOrderEntity]);

      const result = await orderPersistence.findById(mockOrderId);

      expect(result).toBeInstanceOf(Order);
      expect(result?.id).toBe(mockOrderId);
    });

    it('deve retornar null se o pedido não for encontrado', async () => {
      mockConnection.query.mockResolvedValueOnce([]);

      const result = await orderPersistence.findById(mockOrderId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve lançar OrderPersistenceError se houver erro ao criar um pedido', async () => {
      const mockOrder = new Order({
        id: mockOrderId,
        sequence: 12345,
        status: 'READY',
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockConnection.query.mockRejectedValueOnce(new Error('DB Error'));

      await expect(orderPersistence.create(mockOrder)).rejects.toThrow(
        OrderPersistenceError,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
