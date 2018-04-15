

var express = require('express');
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var ObjectID = mongodb.ObjectID;

const config = require('../config');
const utils = require('../utils');

var postsRouter = express.Router();

postsRouter.get("/posts", function(request, response){
    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/posts", databaseConnection, error, response);
        } else {
            console.log("[/posts]: Connection stablished with mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/posts", databaseConnection, error, response);
                } else {
                    console.log("[/posts]: Connection stablished with the collection 'posts'.");
                    let find_parameters = {};
                    if(request.query.categories)
                        find_parameters["categories"] = { "$elemMatch": { "$in": request.query.categories} };
                    if(request.query.dates && request.query.dates.min && request.query.dates.max) {
                        let minDate = new Date(request.query.dates.min).toISOString();
                        let maxDate = new Date(request.query.dates.max).toISOString();
                        find_parameters["date"] = {
                            $gte: new Date(minDate),
                            $lte: new Date(maxDate)
                        };
                    }
                    collection.find(find_parameters, { date: 1, title: 1, img: 1, categories: 1, comments: 1, likes: 1, shares: 1 })
                        .sort({ date: -1 })
                        .toArray(function(error, documents) {
                            if(error){
                                utils.handleError("/posts", databaseConnection, error, response);
                            } else if(documents != null){
                                databaseConnection.close();
                                console.log("[/posts]: Connection closed with the db.");
                                response.json(documents).status(200).end();
                            } else {
                                console.log("[/posts]: There is any post for this parameters.");
                                databaseConnection.close();
                                console.log("[/posts]: Connection closed with the db.");
                                response.json({message: "No existen posts en esta categoría."}).status(204).end();
                            }
                        });
                }
            });
        }
    });
});

postsRouter.get("/posts/:category", function(request, response){
    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/posts/:category", databaseConnection, error, response);
        } else {
            console.log("[/posts/:category]: Connection stablished with mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/posts/:category", databaseConnection, error, response);
                } else {
                    console.log("[/posts/:category]: Connection stablished with the collection 'posts'.");
                    collection.find({categories: request.params.category}, {date: 1, title: 1, img: 1, categories: 1, comments: 1, likes: 1, shares: 1})
                        .sort({date: -1})
                        .toArray(function(error, documents){
                            if(error){
                                utils.handleError("/posts/:category", databaseConnection, error, response);
                            } else if(documents != null){
                                databaseConnection.close();
                                console.log("[/posts/:category]: Connection closed with the db.");
                                response.json(documents).status(200).end();
                            } else {
                                console.log("[/posts/:category]: There is no post for this parameters.");
                                databaseConnection.close();
                                console.log("[/posts/:category]: Connection closed with the db.");
                                response.json({message: "No existen posts en esta categoría."}).status(204).end();
                            }
                        });
                }
            });
        }
    });
});

postsRouter.get("/post/:postID", function(request, response){
    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/post/:postID", databaseConnection, error, response);
        } else {
            console.log("[/post/:postID]: Connection stablished with the db " + config.database.host + ":" + config.database.port + "/" + config.database.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/post/:postID", databaseConnection, error, response);
                } else {
                    console.log("[/post/:postID]: Connection stablished with the collection 'posts'.");
                    collection
                        .find({_id: ObjectID(request.params.postID)})
                        .sort({date: -1})
                        .toArray(function(error, documents){
                            if(error){
                                utils.handleError("/post/:postID", databaseConnection, error, response);
                            } else if(documents != null){
                                databaseConnection.close();
                                response.json(documents).status(200).end();
                            } else {
                                console.log("[/post/:postID]: There is no post for these parameters.");
                                databaseConnection.close();
                                response.json({message: "No existe el post seleccionado."}).status(204).end();
                            }
                        });
                }
            });
        }
    });
});

postsRouter.put("/savePost", function (request, response) {
    var documentObject = {
        img: response.req.body.img,
        html: response.req.body.html,
        date: new Date(new Date(response.req.body.date).toISOString()),
        categories: response.req.body.categories,
        title: response.req.body.title,
        likes: 0,
        shares: 0,
        comments: 0
    };
    var objectId;
    if(response.req.body.id !== "")
        objectId = new ObjectID(response.req.body.id);
    else
        objectId = new ObjectID();

    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/savePost", databaseConnection, error, response);
        } else {
            console.log("[/savePost]: Connection stablished with the db " + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/savePost", databaseConnection, error, response);
                } else {
                    console.log("[/savePost]: Connection stablished with the collection 'posts'.");
                    collection.findOneAndUpdate({_id: objectId}, documentObject, function(err, insertedDocument) {
                        if(error){
                            utils.handleError("/savePost", databaseConnection, error, response);
                        } else {
                            if(insertedDocument.value) {
                                console.log("[/savePost]: Post guardado correctamente");
                                databaseConnection.close();
                                response.json({message: "Post guardado correctamente"}).status(200).end();
                            }
                            else {
                                collection.insertOne(documentObject, function(err, insertedDocuments) {
                                    if(error){
                                        utils.handleError("/savePost", databaseConnection, error, response);
                                    } else {
                                        console.log("[/savePost]: Post guardado correctamente");
                                        databaseConnection.close();
                                        response.json({message: "Post guardado correctamente"}).status(200).end();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
});

postsRouter.delete("/deletePost", function (request, response) {
    var objectId = new ObjectID(response.req.body.id);

    MongoClient.connect(config.mongoUrl, {poolSize: config.database.poolSize, autoReconnect: config.database.autoReconnect}, function (error, databaseConnection) {
        if(error){
            utils.handleError("/deletePost", databaseConnection, error, response);
        } else {
            console.log("[/deletePost]: Connection stablished with the db " + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    utils.handleError("/deletePost", databaseConnection, error, response);
                } else {
                    collection.deleteOne({_id: objectId}, function(err, deletedDocument) {
                        if(error){
                            utils.handleError("/deletePost", databaseConnection, error, response);
                        } else {
                            console.log("[/deletePost]: Post eliminado correctamente");
                            databaseConnection.close();
                            response.json({message: "Post eliminado correctamente"}).status(200).end();
                        }
                    });
                }
            });
        }
    });
});

module.exports = postsRouter;