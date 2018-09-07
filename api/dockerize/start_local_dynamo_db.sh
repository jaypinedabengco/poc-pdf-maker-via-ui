#!/bin/bash
CONTAINER_NAME=poc_pdf_dynamo_db
EXPOSED_PORT=8000

# Stop & Delete container if exist
docker stop $CONTAINER_NAME || true && docker rm $CONTAINER_NAME || true

# Run
docker run --restart always \
-p $EXPOSED_PORT:8000 -d --name $CONTAINER_NAME amazon/dynamodb-local