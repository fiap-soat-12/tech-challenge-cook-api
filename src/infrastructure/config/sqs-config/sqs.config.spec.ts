import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { SqsClient } from './sqs.config';

jest.mock('@aws-sdk/client-sqs'); // Mocka os métodos do AWS SDK

describe('SqsClient', () => {
  let sqsClient: SqsClient;

  beforeEach(() => {
    jest.clearAllMocks(); // Reseta os mocks antes de cada teste
    sqsClient = new SqsClient();
  });

  it('should initialize the SQS client with the correct configuration', () => {
    expect(SQSClient).toHaveBeenCalledWith({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  });

  it('should send a message to the specified queue', async () => {
    const mockSend = jest.fn().mockResolvedValue({});
    (SQSClient.prototype.send as jest.Mock) = mockSend;

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await sqsClient.sendMessage(queueUrl, message);

    // Verifica se o método send foi chamado com a instância correta de SendMessageCommand
    expect(mockSend).toHaveBeenCalledWith(
      expect.any(SendMessageCommand), // Verifica que é um comando válido
    );

    // Verifica os dados do comando enviado
    const sentCommand = mockSend.mock.calls[0][0] as SendMessageCommand;
    expect(sentCommand.input).toEqual({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });
  });

  it('should send a message to the specified queue', async () => {
    const mockSend = jest.fn().mockResolvedValue({});
    (SQSClient.prototype.send as jest.Mock) = mockSend;

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await sqsClient.sendMessage(queueUrl, message);

    // Verifica se o comando foi enviado corretamente
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });

  it('should throw an error if message sending fails', async () => {
    const mockSend = jest
      .fn()
      .mockRejectedValue(new Error('Failed to send message'));
    (SQSClient.prototype.send as jest.Mock) = mockSend;

    const queueUrl = 'http://localhost:4566/queue/my-queue';
    const message = { key: 'value' };

    await expect(sqsClient.sendMessage(queueUrl, message)).rejects.toThrow(
      'Failed to send message',
    );

    // Verifica se o comando foi enviado antes de falhar
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message),
        },
      }),
    );
  });
});
