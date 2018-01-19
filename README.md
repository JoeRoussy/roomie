# Roomie
A comprehensive leasing platform

## Setup
This app runs on node version 8.9.3 and uses mongodb.

### Node
Make sure you have node 8.9.3 installed before installing any packages as the package lock file may force the server to install the wrong version. Also remember to run `npm i` after pulling new changes to make sure you have any new dependencies.

### Mongo
Mongo must be installed and running on your machine before trying to run the app. The version of mongo this app uses is 3.6.x

### Logging
This app logs files to `/var/log/roomie`. This folder must exist and its permissions must be set so the app can create files inside of it

### Environment Variables
Environment variables are loaded into the app from a `.env` file. These key value pairs must in of the form: `key=value` in this file (one per line). These values will be parsed and available in `process.env`.

Required environment variables are:
* SESSION_SECRET: Some random string
* DB_URI: The mongo connection string
* DB_NAME: The name of the database

Optional environment variables are:
* LOG_ROTATING_FILE: Rotating file for logs of all levels other than errors (this is `/var/log/roomie/log.log` by default)
* LOG_ERROR_FILE: Rotating file for error logs (this is `/var/log/roomie/errors.log` by default)

### Running The app
Once all of the above conditions are taken care of, run the front end using `npm run client-dev` and run the server in a new tab using `npm run server-dev`.