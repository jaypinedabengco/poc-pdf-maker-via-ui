#!/bin/bash
CONTAINER_NAME=poc_pdf_maker_db
MYSQL_DB_NAME=poc_pdf_maker_db
MYSQL_DB_USER=root
MYSQL_DB_PASSWORD=password
MYSQL_DB_PORT=53306

docker stop $CONTAINER_NAME || true && docker rm $CONTAINER_NAME || true

docker run --restart always \
-e MYSQL_DATABASE=$MYSQL_DB_NAME \
-e MYSQL_USER=$MYSQL_DB_USER \
-e MYSQL_PASSWORD=$MYSQL_DB_PASSWORD \
-e MYSQL_ROOT_PASSWORD=$MYSQL_DB_PASSWORD \
-p $MYSQL_DB_PORT:3306 -d --name $MYSQL_DB_NAME mysql:5.6