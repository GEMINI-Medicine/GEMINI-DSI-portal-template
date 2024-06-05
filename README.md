# GEMINI-DSI Portal Template

## Description

This is a web portal that facilitates users to access various reports. **Note that this code was highly customized for a particular use case, and may require substantial changes in order to work with your particular use case**.

## Tech Stack

Frontend: NextJS and chakra ui

Backend: KeystoneJS as the CMS and Postgres for the database

S3: Minio to store the actual reports

## Features

- Allow Users to register to the portal
- Login via a magic link
- Fully containarized Application for easy development and deployment
- Fully functional admin portal to allow admin users management of the portal
- GraphQL API

## Folder structure

backend

- Contains all the code relevant to the start up the backend application

frontend

- Contains all the code for the front end application

## Development

1. Start the containers via the following command

   `docker compose up -d`

2. Everytime a change is made to the schema you need to create a migration with following command

   `yarn keystone prisma migrate dev --name name_of_migration`

## Usage

## Deployment

1. Build the docker images using production docker compose file

   `docker compose -f docker-compose.staging.yml build frontend backend`

2. Bring up minio, postgress and traefik services

   `docker compose -f docker-compose.staging.yml up minio postgres traefik -d`

3. Run the yarn migrate command on backend image as an entrypoint command in order to initiate and configure the database

   `docker compose run --rm --entrypoint="yarn migrate" backend`

4. Bring up the backend and front end

   `docker compose -f docker-compose.staging.yml up frontend backend -d`

### Seed Data

`docker compose run --rm --entrypoint="yarn seed-data" backend`

## Contributors

- Wisam Al Abed, [Data Sciences Institute (DSI)](https://datasciences.utoronto.ca/) | University of Toronto
- [GEMINI](https://www.geminimedicine.ca)

## License

[MIT](https://choosealicense.com/licenses/mit/)
