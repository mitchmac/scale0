#!/bin/bash

mkdir temp

cp -r ../../src/ ../../php-files ../../package.json index.php router.php temp

docker build -t docker-lambda-scale0 .

rm -rf temp