var fs = require("fs");
var extend = require("extend");
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var ObjectID = mongodb.ObjectID;
var crypto = require("crypto");
var compression = require("compression");

const app = express();

app.use(compression());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use("/assets/fonts", express.static("../dist/assets/fonts"));
app.use("/assets/img", express.static("../dist/assets/img"));
app.use("/assets/js", express.static("../dist/assets/js"));
app.use("/assets/css", express.static("../dist/assets/css"));
app.use(express.static("../dist"));

const databaseConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    databaseName: process.env.DB_NAME,
    poolSize: process.env.DB_POOL_SIZE,
    autoReconnect: true
}

var mongoUrl = "mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName;

app.get("/posts", function(request, response){
    MongoClient.connect(mongoUrl, {poolSize: databaseConfig.poolSize, autoReconnect: databaseConfig.autoReconnect}, function (error, databaseConnection) {
        if(error){
            console.log("[/posts]: " + error);
            databaseConnection.close();
            console.log("[/posts]: Connection closed with the db.");
            response.status(500).end();
        } else {
            console.log("[/posts]: Connection stablished with mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    console.log("[/posts]: " + error);
                    databaseConnection.close();
                    console.log("[/posts]: Connection closed with the db.");
                    response.status(500).end();
                } else {
                    console.log("[/posts]: Connection stablished with the collection 'posts'.");
                    collection.find({}, {date: 1, title: 1, img: 1, categories: 1, comments: 1, likes: 1, shares: 1})
                        .sort({date: -1})
                        .toArray(function(error, documents){
                            if(error){
                                console.log("[/posts]: " + error);
                                databaseConnection.close();
                                console.log("[/posts]: Connection closed with the db.");
                                response.status(500).end();
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

app.get("/posts/:category", function(request, response){
    MongoClient.connect(mongoUrl, {poolSize: databaseConfig.poolSize, autoReconnect: databaseConfig.autoReconnect}, function (error, databaseConnection) {
        if(error){
            console.log("[/posts]: " + error);
            databaseConnection.close();
            console.log("[/posts]: Connection closed with the db.");
            response.status(500).end();
        } else {
            console.log("[/posts]: Connection stablished with mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    console.log("[/posts]: " + error);
                    databaseConnection.close();
                    console.log("[/posts]: Connection closed with the db.");
                    response.status(500).end();
                } else {
                    console.log("[/posts]: Connection stablished with the collection 'posts'.");
                    collection.find({categories: request.params.category}, {date: 1, title: 1, img: 1, categories: 1, comments: 1, likes: 1, shares: 1})
                        .sort({date: -1})
                        .toArray(function(error, documents){
                            if(error){
                                console.log("[/posts]: " + error);
                                databaseConnection.close();
                                console.log("[/posts]: Connection closed with the db.");
                                response.status(500).end();
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

app.get("/post/:postID", function(request, response){
    MongoClient.connect(mongoUrl, {poolSize: databaseConfig.poolSize, autoReconnect: databaseConfig.autoReconnect}, function (error, databaseConnection) {
        if(error){
            console.log("[/posts/" + request.params.postID + "]: " + error);
            databaseConnection.close();
            console.log("[/posts/" + request.params.postID + "]: Connection closed with the db.");
            response.status(500).end();
        } else {
            console.log("[/posts/" + request.params.postID + "]: Connection stablished with the db " + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("posts", function(error, collection){
                if(error){
                    console.log("[/posts/" + request.params.postID + "]: " + error);
                    databaseConnection.close();
                    console.log("[/posts/" + request.params.postID + "]: Connection closed with the db.");
                    response.status(500).end();
                } else {
                    console.log("[/posts/" + request.params.postID + "]: Connection stablished with the collection 'posts'.");
                    collection
                        .find({_id: ObjectID(request.params.postID)})
                        .sort({date: -1})
                        .toArray(function(error, documents){
                            if(error){
                                console.log("[/posts/" + request.params.postID + "]: " + error);
                                databaseConnection.close();
                                console.log("[/posts/" + request.params.postID + "]: Connection closed with the db.");
                                response.status(500).end();
                            } else if(documents != null){
                                databaseConnection.close();
                                response.json(documents).status(200).end();
                            } else {
                                console.log("[/posts/" + request.params.postID + "]: There is any post for this parameters.");
                                databaseConnection.close();
                                response.json({message: "No existe el post seleccionado."}).status(204).end();
                            }
                        });
                }
            });
        }
    });
});

app.get("/categories", function(request, response){
    MongoClient.connect(mongoUrl, {poolSize: databaseConfig.poolSize, autoReconnect: databaseConfig.autoReconnect}, function(error, databaseConnection) {
        if(error){
            handleError("/categories", databaseConnection, error, response);
        } else {
            console.log("[/categories]: Connection stablished with mongodb://" + databaseConfig.host + ":" + databaseConfig.port + "/" + databaseConfig.databaseName);
            databaseConnection.collection("categories", function(error, collection){
                if(error){
                    handleError("/categories", databaseConnection, error, response);
                } else {
                    console.log("[/categories]: Connection stablished with the collection 'categories'.");
                    collection.find({}, {}).toArray(function(error, documents){
                        if(error){
                            handleError("/categories", databaseConnection, error, response);
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

app.get("/*", function(request, response){
    if(request.originalUrl !== "/about_me.html" && request.originalUrl !== "/contacto.html/" && request.originalUrl !== "/contacto.html")
        response.sendFile("/index.html", {"root": __dirname + "/../dist"});
});


app.listen(3001, function(){
    console.log('Servidor iniciado con Express en puerto 3001')
});
