# ICS-POC
Interaction Computing System Proof of Concept


## Installation

switch to the folder and type `npm install`

## Configuration

### Set AMQP url

to set the url for the AMQP Message Broker there are 2 options:

- set via ENVIRONMENT Variable `AMQP_HOST`
- set in config file `config/config.js`

default is `amqp://localhost:5672`

Message Broker are available via:
- Cloud https://www.cloudamqp.com/
- Docker https://www.docker.com/ (Dockerfile https://hub.docker.com/_/rabbitmq/)
- Local installation https://www.rabbitmq.com/

## Startup

1) to start the Manager type `node Manager.js`

2) to start the Worker type `node WorkerNode.js <WORKER_ID>`

3) to open the management console open a browser with url `http://<MANAGER_HOST>:3000`

if the manager is on localhost type http://localhost:3000