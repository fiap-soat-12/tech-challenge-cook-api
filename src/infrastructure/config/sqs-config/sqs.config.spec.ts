import { SqsClient as AppSqsClient } from './sqs.config'; // Usando alias para evitar conflito de nomes

jest.mock('@aws-sdk/client-sqs', () => {
  const sendMock = jest.fn();

  return {
    SQSClient: jest.fn(() => ({
      send: sendMock,
    })),
    SendMessageCommand: jest.fn((input) => ({ input })),
    __mocks__: { sendMock }, // Expondo o mock para uso nos testes
  };
});

describe('AppSqsClient', () => {
  let sqsClient: AppSqsClient;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Obtém o mock do método `send` diretamente do módulo mockado
    sendMock = jest.requireMock('@aws-sdk/client-sqs').__mocks__
      .sendMock as jest.Mock;

    // Inicializa a instância do SqsClient (que internamente usará o mock)
    sqsClient = new AppSqsClient();
  });

  it('should send a message to the specified queue', async () => {
    sendMock.mockResolvedValue(undefined); // Simula execução bem-sucedida sem retorno

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await sqsClient.sendMessage(queueUrl, message);

    // Verifica que o método `send` foi chamado corretamente
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });

  it('should send a message to the specified queue', async () => {
    sendMock.mockResolvedValueOnce(undefined); // Simula execução bem-sucedida sem retorno

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await sqsClient.sendMessage(queueUrl, message);

    // Verifica que o método `send` foi chamado corretamente
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });

  it('should throw an error if message sending fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('Failed to send message')); // Simula erro na execução

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await expect(sqsClient.sendMessage(queueUrl, message)).rejects.toThrow(
      'Failed to send message',
    );

    // Verifica que o método `send` foi chamado antes de falhar
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });
});
