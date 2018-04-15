var express = require('express');
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;

const config = require('../config');
const utils = require('../utils');

var categoriesRouter = express.Router();

categoriesRouter.get("/categories", function(request, response){
    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function(error, databaseConnection) {
        if(error){
            utils.handleError("/categories", databaseConnection, error, response);
        } else {
            console.log("[/categories]: Connection stablished with mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.databaseName);
            databaseConnection.collection("categories", function(error, collection){
                if(error){
                    utils.handleError("/categories", databaseConnection, error, response);
                } else {
                    console.log("[/categories]: Connection stablished with the collection 'categories'.");
                    collection.find({}, {}).toArray(function(error, documents){
                        if(error){
                            utils.handleError("/categories", databaseConnection, error, response);
                        } else if(documents != null){
                            databaseConnection.close();
                            console.log("[/categories]: Connection closed with the db.");
                            response.json(documents).status(200).end();
                        } else {
                            console.log("[/categories]: There isn't any category.");
                            databaseConnection.close();
                            console.log("[/categories]: Connection closed with the db.");
                            response.json({message: "No existen categorías"}).status(204).end();
                        }
                    });
                }
            });
        }
    });
});

categoriesRouter.put("/saveCategory", function (request, response) {
    var documentObject = {
        name: response.req.body.category,
        url: response.req.body.category_url
    };

    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function(error, databaseConnection) {
        if(error){
            utils.handleError("/saveCategory", databaseConnection, error, response);
        } else {
            console.log("[/saveCategory]: Connection stablished with the db " + config.database.host + ":" + config.database.port + "/" + config.database.databaseName);
            databaseConnection.collection("categories", function(error, collection){
                if(error){
                    utils.handleError("/saveCategory", databaseConnection, error, response);
                } else {
                    console.log("[/saveCategory]: Connection stablished with the collection 'categories'.");

                    collection.insertOne(documentObject, function(err, insertedDocuments) {
                        if(error){
                            utils.handleError("/saveCategory", databaseConnection, error, response);
                        } else {
                            console.log("[/saveCategory]: Categoría guardada correctamente");
                            databaseConnection.close();
                            response.json({message: "Categoría guardada correctamente"}).status(200).end();
                        }
                    });
                }
            });
        }
    });
});

module.exports = categoriesRouter;