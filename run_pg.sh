docker stop ipr-pg-container
docker rm ipr-pg-container
docker build -t ipr-pg .
docker run --name ipr-pg-container -d -p 5432:5432 ipr-pg
