#!/bin/bash

mkdir temp

cp -r ../../src/ ../../php-files ../../package.json index.php router.php static.css temp

docker build -t docker-lambda-scale0 .

rm -rf temp