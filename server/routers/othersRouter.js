var express = require('express');
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var ObjectID = mongodb.ObjectID;

var formidable = require('formidable');
var move = require('mv');

const config = require('../config');
const utils = require('../utils');

var othersRouter = express.Router();

othersRouter.post("/saveImage", function (request, response) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        var oldpath = files.image.path;
        var newpath = __dirname + "/../../elobservadorpacifico/dist/assets/img/" + files.image.name;
        move(oldpath, newpath, function (err) {
            if(err){
                console.log(err);
                response.status(500).end();
            }
            response.status(200).json({
                message: 'File uploaded and moved!',
                filePath: 'assets/img/' + files.image.name
            }).end();
        });
    });
});

othersRouter.get("/dates", function(request, response){
    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/dates", databaseConnection, error, response);
        } else {
            console.log("[/dates]: Connection stablished with mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/dates", databaseConnection, error, response);
                } else {
                    console.log("[/dates]: Connection stablished with the collection posts.");
                    collection.aggregate([
                        { "$group": {
                                "_id": null,
                                "min": { "$min": "$date" },
                                "max": { "$max": "$date" }
                            }}
                    ], function(err, documents) {
                        if(error){
                            utils.handleError("/dates", databaseConnection, error, response);
                        } else if(documents != null){
                            databaseConnection.close();
                            console.log("[/dates]: Connection closed with the db.");
                            response.json(documents).status(200).end();
                        } else {
                            console.log("[/dates]: There isn't any date.");
                            databaseConnection.close();
                            console.log("[/dates]: Connection closed with the db.");
                            response.json({message: "No existen fechas"}).status(204).end();
                        }
                    });
                }
            });
        }
    });
});

module.exports = othersRouter;