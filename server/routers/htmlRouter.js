var express = require('express');

var htmlHandler = express.Router();

htmlHandler.get("*", function(request, response, next){
    var isAjaxRequest = request.xhr;
    if(request.originalUrl === "/about_me.html") {
        response.sendFile("/about_me.html", {"root": __dirname + "/../../dist"}, function(error) {
            if(!error) console.log("Fichero about_me.html enviado.")
        });
    } else if(!isAjaxRequest){
        response.sendFile("/index.html", {"root": __dirname + "/../../dist"}, function(error) {
            if(!error) console.log("Fichero index.html enviado.")
        });
    } else {
        next();
    }
});

module.exports = htmlHandler;