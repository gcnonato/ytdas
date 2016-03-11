/*
    AUTHENTICATION
    
    Have all of our authentication done here.
    
    accept the entire express app from the app.js
    then go through all of the ensureAuthenticated and ensureAdmin that we have from our main site.
*/

/*jslint node: true */
/*jslint nomen: true */

var passport = require('passport'),
    session = require('express-session'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    serverConf = require(__dirname + '/../../config.json'),
    GOOGLE_CLIENT_ID = serverConf.server.clientId,
    GOOGLE_CLIENT_SECRET = serverConf.server.clientSecret,
    callbackUrl = serverConf.server.callback;

passport.serializeUser(function (user, done) {
    'use strict';
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    'use strict';
    done(null, obj);
});

module.exports = function (app) {
    'use strict';
    
    function sook(req, res, next) {
        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: callbackUrl
        },
            function (accessToken, refreshToken, profile, done) {
            
                process.nextTick(function () {
                                                                                     

                    return done(null, [{token: accessToken, rToken: refreshToken, 'profile': profile}]);
                });
            }
            ));
        return next();
    }
    
    
    app.use(session({secret: serverConf.server.sessionSecret}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.get('/auth', sook,
        passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/yt-analytics.readonly', 'https://www.googleapis.com/auth/yt-analytics-monetary.readonly', 'https://www.googleapis.com/auth/youtubepartner', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/youtubepartner-channel-audit']})
           );
    
    app.get('/auth/callback',
        passport.authenticate('google', { failureRedirect: '/signup' }),
        function (req, res) {
        
            res.redirect('/dashboard');
        }

           );
    
};

