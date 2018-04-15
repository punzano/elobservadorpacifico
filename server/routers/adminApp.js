var express = require("express");
var admin = express.Router();

var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var compression = require("compression");

const adminApp = express();

adminApp.use(compression());
adminApp.use(bodyParser.json()); // to support JSON-encoded bodies
adminApp.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
adminApp.use(cookieParser());
adminApp.use(passport.initialize());
adminApp.use(passport.session());

adminApp.use("*/assets/fonts", express.static(__dirname + "/../../dist/assets/fonts"));
adminApp.use("*/assets/img", express.static(__dirname + "/../../dist/assets/img"));
adminApp.use("*/assets/js", express.static(__dirname + "/../../dist/assets/js"));
adminApp.use("*/assets/css", express.static(__dirname + "/../../dist/assets/css"));
//adminRouter.use(express.static(__dirname + "../dist"));

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        if(profile.id === process.env.GOOGLE_PROFILE_ID) {
            done(null, profile);
        } else {
            done(null, false, { message: 'Incorrect account' });
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user)
});
passport.deserializeUser(function(user, done) {
    done(null, user)
});

adminApp.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

adminApp.get('/auth/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
        if (err) {
            console.log(err);
        }
        else if (!user) {
            return res.redirect('/incorrectAccount');
        }
        else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/home');
            });
        }
    })(req, res, next);
});

adminApp.get('/auth/google/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

adminApp.get("/home", function (request, response) {
    if(request.user) {
        response.sendFile("/adminHome.html", {"root": __dirname + "/../../dist"}, function(error) {
            if(!error) console.log("Fichero adminHome.html enviado.")
        });
    } else {
        response.redirect("/login");
    }
});
adminApp.get("/editor/*", function (request, response) {
    if(request.user) {
        response.sendFile("/adminHome.html", {"root": __dirname + "/../../dist"}, function(error) {
            if(!error) console.log("Fichero adminHome.html enviado.")
        });
    } else {
        response.redirect("/login");
    }
});

adminApp.get("/login", function (request, response) {
    if(!request.user) {
        response.sendFile("/adminLogin.html", {"root": __dirname + "/../../dist"}, function(error) {
            if(!error) console.log("Fichero adminLogin.html enviado.")
        });
    } else {
        response.redirect("/home");
    }
});
adminApp.get("/incorrectAccount", function (request, response) {
    response.sendFile("/adminLogin.html", {"root": __dirname + "/../../dist"}, function(error) {
        if(!error) console.log("Fichero adminLogin.html enviado.")
    });
});

adminApp.get("/", function(request, response){
    if (request.user) {
        response.redirect("/home");
    } else {
        response.redirect("/login");
    }
});

module.exports = adminApp;


