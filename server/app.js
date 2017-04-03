var fs = require("fs");
var extend = require("extend");
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var crypto = require("crypto");
var compression = require("compression");
var nodeCron = require("node-cron");

const router = express.Router();
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
    host: "localhost",
    port: 27017,
    databaseName: "elobservadorpacifico"
}

var server = new mongodb.Server(databaseConfig.host, databaseConfig.port, {});

app.get("/posts", function(request, response){
    var database = new mongodb.Db(databaseConfig.databaseName, server, {});

    database.open(function (error, databaseConnection) {
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
                    collection.find({}, {date: 1, title: 1, img: 1, category: 1, comments: 1, likes: 1, shares: 1})
                        .sort({date: 1})
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
    var database = new mongodb.Db(databaseConfig.databaseName, server, {});

    database.open(function (error, databaseConnection) {
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
                    collection.find({category: request.params.category}, {date: 1, title: 1, img: 1, category: 1, comments: 1, likes: 1, shares: 1})
                        .sort({date: 1})
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
    var database = new mongodb.Db(databaseConfig.databaseName, server, {});

    database.open(function (error, databaseConnection) {
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
                        .sort({date: 1})
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

app.get("/*", function(request, response){
    response.sendFile("/index.html", {"root": __dirname + "/../dist"});
});


app.listen(3000, function(){
    console.log('Servidor iniciado con Express en puerto 3000')
});
