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

### Running The app
Once all of the above conditions are taken care of, run the app using `npm start`.
