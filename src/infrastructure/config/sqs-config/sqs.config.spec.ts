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
    sendMock = jest.requireMock('@aws-sdk/client-sqs').__mocks__
      .sendMock as jest.Mock;

    sqsClient = new AppSqsClient();
  });

  it('should send a message to the specified queue', async () => {
    sendMock.mockResolvedValue(undefined);

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
    sendMock.mockResolvedValueOnce(undefined);

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await sqsClient.sendMessage(queueUrl, message);

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
    sendMock.mockRejectedValueOnce(new Error('Failed to send message'));

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await expect(sqsClient.sendMessage(queueUrl, message)).rejects.toThrow(
      'Failed to send message',
    );

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
