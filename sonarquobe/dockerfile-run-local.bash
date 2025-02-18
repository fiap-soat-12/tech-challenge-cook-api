#!/bin/bash

docker build -t tech-challenge-cook-api \
  --build-arg DB_TYPE=postgresql \
  --build-arg DB_USER=postgres \
  --build-arg DB_HOST=localhost \
  --build-arg DB_NAME=tc-cook-db \
  --build-arg DB_PASSWORD=password \
  --build-arg DB_PORT=5432 \
  --build-arg TZ=America/Sao_Paulo \
  --build-arg AWS_REGION=us-east-1 \
  --build-arg ORDER_PRODUCT_CREATE_QUEUE=order-product-create-queue \
  --build-arg ORDER_PRODUCT_CREATE_ACCEPT_QUEUE=order-product-create-accept-queue \
  --build-arg ORDER_PRODUCT_DELETE_QUEUE=order-product-delete-queue \
  --build-arg ORDER_PRODUCT_DELETE_ACCEPT_QUEUE=order-product-delete-accept-queue \
  --build-arg ORDER_PRODUCT_UPDATE_QUEUE=order-product-update-queue \
  --build-arg ORDER_PRODUCT_UPDATE_ACCEPT_QUEUE=order-product-update-accept-queue \
  --build-arg COOK_ORDER_CREATE_QUEUE=cook-order-create-queue \
  --build-arg ORDER_STATUS_UPDATE_QUEUE=order-status-update-queue \
  --build-arg AWS_ACCESS_KEY_ID=teste \
  --build-arg AWS_SECRET_ACCESS_KEY=teste \
  --build-arg AWS_ENDPOINT=http://localhost:4566 \
  --build-arg AWS_URL=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000 .
