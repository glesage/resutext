// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

    user.signUp().then(function(user) {
      var UserSettings = Parse.Object.extend("UserSettings");
      var query = new Parse.Query(UserSettings);
      var userSettings = new UserSettings();
      userSettings.set("user", user);
      userSettings.save().then(function(userSettings) {
        user.set("userSettings", userSettings);
        user.save();
        res.redirect('/');
      });
    }, function(error) {
      // Show the error message and let the user try again
      res.render('signup', { flash: error.message });
    });
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  // Logs in the user
  app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
      res.redirect('/');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  // Logs out the user
  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  app.get('/debug', function(req, res) {
    res.cookie('name2', 'val3');
    res.send('Success');
  });





  app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
    var linkedin = require('cloud/modules/linkedin/linkedin');
    console.log('initialize');

    var cookies = linkedin.getCookies(req);
    console.log(cookies);


    if (cookies['LIAccess_token']) {
      console.log('exec step 3');
    }
    else {
      var url= require('url');
      var queryObject = url.parse(req.url, true).query;
      if (!queryObject.code) {
        console.log('STEP 1');
        console.log('REDIRECT FOR AUTH');
        linkedin.getAuthorizationCode(req, res);
      }
      else {
        console.log('STEP2');
        linkedin.getAccessToken(req, res, queryObject.code);
      }
    }
  });

  return app;
}();


