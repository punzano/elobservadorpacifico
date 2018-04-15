var fs = require("fs");
var extend = require("extend");
var express = require("express");
var bodyParser = require("body-parser");
var compression = require("compression");
var subdomain = require("express-subdomain");
var vhost = require('vhost');

const app = express();

const adminApp = require('./routers/adminApp');
const htmlRouter = require('./routers/htmlRouter');
const postsRouter = require('./routers/postsRouter');
const categoriesRouter = require('./routers/categoriesRouter');
const othersRouter = require('./routers/othersRouter');

app.use(compression());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use("*/assets/fonts", express.static("../dist/assets/fonts"));
app.use("*/assets/img", express.static("../dist/assets/img"));
app.use("*/assets/js", express.static("../dist/assets/js"));
app.use("*/assets/css", express.static("../dist/assets/css"));

app.use(vhost('admin.*', adminApp));
app.use(vhost('www.observandopacificamente.*', htmlRouter, postsRouter, categoriesRouter, othersRouter));
app.use(vhost('observandopacificamente.*', htmlRouter, postsRouter, categoriesRouter, othersRouter));


app.listen(3001, function(){
    console.log('Blog Observando Pacíficamente iniciado con Express en el puerto 3001')
});


