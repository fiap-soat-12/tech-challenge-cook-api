#!/bin/bash

# Configura o AWS CLI
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set default.region us-east-1

# Cria produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-create-queue

# Exclui produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-delete-queue

# Atualiza produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-update-queue

# Criação de pedidos na fila de produção
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name cook-order-create-queue

# Evolui pedidos na fila de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-status-update-queue

# Lista filas criadas no localstack
aws --endpoint-url=http://localhost:4566 sqs list-queues

# Resultado esperado
# {
#     "QueueUrls": [
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-create-queue",
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-create-accept-queue",
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-delete-queue",
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-update-queue",
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/cook-order-create-queue",
#         "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-status-update-queue"
#     ]
# }
