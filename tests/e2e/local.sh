#!/bin/bash

./build-test.sh

docker run -p 9000:8080 -d --name scale0-local docker-lambda-scale0

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"path":"/index.php"}'

curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"path":"/static.css"}'

docker stop scale0-local
docker rm scale0-local