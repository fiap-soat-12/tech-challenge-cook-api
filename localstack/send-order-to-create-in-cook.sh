aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url http://localhost:4566/000000000000/cook-order-create-queue --cli-binary-format raw-in-base64-out --message-body "{\"id\":\"123e4567-e89b-12d3-a456-426614174000\",\"sequence\":1,\"status\":\"PREPARING\",\"products\":[{\"id\":\"5ac984c4-3dcf-41d7-8dcd-3d8f5d808351\",\"customization\":\"extra cheese\"},{\"id\":\"212b7931-6d29-4b3e-8206-1f52ebf1dbd1\",\"customization\":\"no onions\"}]}"
aws --endpoint="http://localhost:4566/" sqs purge-queue --queue-url http://localhost:4566/000000000000/cook-order-create-queue
