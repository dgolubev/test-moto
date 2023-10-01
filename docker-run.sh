#!/bin/bash

cd $(dirname "$0") || return

docker-compose up  --build --remove-orphans --force-recreate
docker-compose down --volumes --remove-orphans

docker rmi -f $(docker image ls "*test-moto-*"  --format "{{.ID}}")

docker volume prune -f
