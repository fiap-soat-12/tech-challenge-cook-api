# -> Cria produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-create-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-create-accept-queue

# -> Exclui produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-delete-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-delete-accept-queue

# -> Atualiza produtos na base de pedidos
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-update-queue
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name order-product-update-accept-queue

# -> Lista filas criadas no localstack
aws --endpoint-url=http://localhost:4566 sqs list-queues

# -> Resultado esperado
#{
#    "QueueUrls": [
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-create-queue",
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-create-accept-queue",
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-delete-queue",
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-delete-accept-queue",
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-update-queue",
#        "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-product-update-accept-queue"
#    ]
#}
