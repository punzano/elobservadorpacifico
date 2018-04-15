'use strict'

const database = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    databaseName: process.env.DB_NAME,
    poolSize: process.env.DB_POOL_SIZE,
    autoReconnect: true
}

let mongoUrl = "mongodb://" + database.host + ":" + database.port + "/" + database.databaseName;

module.exports = {
    database: database,
    mongoUrl: mongoUrl
}