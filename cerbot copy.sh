#!/bin/bash

sudo cd /home/ubuntu/projects/Insurance-Backend
sudo docker-compose down
sudo docker system prune --force
sudo git checkout production
sudo git pull origin production 
sudo docker-compose up -d