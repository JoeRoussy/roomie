# Roomie
A comprehensive leasing platform

## Setup
This app runs on node version 8.9.3 and uses mongodb.

### Node
Make sure you have node 8.9.3 installed before installing any packages as the package lock file may force the server to install the wrong version. Also remember to run `npm i` after pulling new changes to make sure you have any new dependencies.

### Mongo
Mongo must be installed and running on your machine before trying to run the app. The version of mongo this app uses is 3.6.x
#### Schema
The following is the schema of every collection in the database
##### User
```
{
    "_id" : ObjectId("5a736ea34aa7683a26563f50"),
    "name" : "Joe Roussy 27",
    "email" : "joeroussy+27@gmail.com",
    "password" : "$2a$12$IcrNgsEvxlIwAATHyt6x7uDmWFIpLS5FJMonEZJdi2rbuUoPXX7y6",
    "profilePictureLink" : "/assets/42df91899b4f4ae0d143ac93125a86081517444232096.jpeg",
    "isLandlord" : false,
    "isEmailConfirmed": true,
    "createdAt" : ISODate("2018-02-01T19:46:43.079Z")
}
```
##### Verification
```
{
    "_id": ObjectId("5aa06d13b79334668e299785"),
    "urlIdentifyer" : "1bb86f0ca20b6e2727e10de850339ed68945b382c30323c321c807bec1218e8a1520463123571",
    "userId" : ObjectId("5aa06d13b79334668e299784"),
    "isCompeted" : true,
    "type" : "email",
    "createdAt" : ISODate("2018-03-07T22:52:03.571Z")
}
```
##### Listing
```
{
    “_id":"5a664d7d1c805e089c349ec6",
    "name":"Jugal's Place",
    "address":"1 Rainbow Road",
    "description":"It’s aite.",
    "keywords": ["plants", "windows"],
    "bathroom": 1,
    "bedroom": 2,
    "furnished": "Yes",
    "Views":11,
    "location":"Placeville",
    "lat": 35.234,
    "lng": 78.123,
    "ownerId":"5a79de27431d9e0a2c8fbd4b",
    "createdAt":ISODate("2018-02-06 12:26:57.209")
}
```
##### Password Reset
```
{
    "_id" : ObjectId("5aa386a1cd37e6a171dc75c4"),
    "userId" : ObjectId("5aa06d13b79334668e299784"),
    "urlIdentifyer" : "4facffe8c323f961ad00bba16223a2bfedf2e8be4c499cb467aec0f85ef6878d1520666273741",
    "expired" : true,
    "createdAt" : ISODate("2018-03-10T07:17:53.741Z")
}
```

##### Channel
```
{
    "_id" : ObjectId("5aa40a9e383fdf132025ccc4"),
    "name" : "Test",
    "users" : [
        {
            "userId" : ObjectId("5aa16bcedc440749402697ba"),
            "acceptedInvite" : true
        }
    ],
    "admin" : ObjectId("5aa16bcedc440749402697ba"),
    "createdAt" : ISODate("2018-03-10T16:41:02.740Z")
}
```
##### Message
```
{
    "_id" : ObjectId("5aa54cae956974424063e266"),
    "channelId" : ObjectId("5aa40a9e383fdf132025ccc4"),
    "userName" : "5a9cb7dbc227cc57bc7b9555",
    "body" : "Hello",
    "createdAt" : ISODate("2018-03-11T15:35:10.643Z")
}
```

#### Text Searches
In order to perform a text search a collection needs to have a text index on the field being searched and it must also declare a language. Note that if you are using a text search on an aggregation pipeline, it must be the first field in the `$match` field.

Declaring a language means each document has a `language` field set to a language, for example: `english`.

To make a text index on a field, use the following command (in the mongo shell for example):
```
db.<collection>.createIndex( { <field>: "text" } )

// For example:
db.reviews.createIndex( { comments: "text" } )
```
The following collections have a text index:
* Listings on location


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
