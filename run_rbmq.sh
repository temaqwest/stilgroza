docker stop ipr-rabbitmq-container
docker rm ipr-rabbitmq-container
docker run --name ipr-rabbitmq-container --rm -p 15672:15672 rabbitmq:3.10.7-management
