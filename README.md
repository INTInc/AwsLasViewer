# AwsLasViewer
An example of Well Log Viewer to read data from AWS LAS files
In order to run this project, you can use docker and docker compose.

Install docker and docker compose
Set correct environment variables "AWS_REGION" "AWS_ACCESS_KEY" "AWS_SECRET_KEY" "AWS_S3_BUCKET" "NPM_TOKEN" and "SERVER" in .env file.
Run docker-compose up --force-recreate --build

After these steps, application will be running on :80 port of your machine.

Also it can be run on local server. See instruction for client and server
1) Server: cd server & npm i & npm run start:dev
2) Client: cd client & npm i & npm run start