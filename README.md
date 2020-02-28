# Coding exercise

## Prerequisites

- docker and docker-compose 
- nodejs

## How to run the service

### 1. Pull the dependencies

You will have to run `npm install` in order to pull all the dependencies.

### 2. Run the DB

Use the command `docker-compose up -d`
This will create a docker container with a mongodb on the port 27017

### 3. Run the server 

Use the command `npm run start`
The server will be launched locally on the port 1234

## Tests

If you need to run the tests, use the command `npm run test` which will run all the test in the tests folder and subfolders.
The test will need a DB up and running as mentioned under the number 2.