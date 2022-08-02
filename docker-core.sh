#!/bin/bash

set -e

DOCKER_IMAGE=$1
CONTAINER_NAME=$2
DOCKER_LOGIN=$3
DOCKER_PWD=$4


# Check for arguments
if [[ $# -lt 4 ]] ; then
        echo '[ERROR] You must supply a Docker image, container, login and password'
        echo 'Deployment will not exit'
        exit 1
fi
echo DOCKER_IMAGE

# Check for running container & stop it before starting a new one
# echo "Checking if container name "
if [ "$(sudo docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" != "true" ]; then
        echo "No container with the name is installed on the servers docker engine"
elif [ "$(sudo docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" == "true" ]; then
        sudo docker stop $CONTAINER_NAME
        echo "Stopping the container found during inspections: $CONTAINER_NAME"
        sudo docker rm $CONTAINER_NAME
fi



echo "Starting Docker image name: $DOCKER_IMAGE"

echo $DOCKER_PWD | sudo docker login -u $DOCKER_LOGIN --password-stdin

sudo docker run -d -p 4000:4000 --restart always --name $CONTAINER_NAME $DOCKER_IMAGE

sudo docker ps -a