/**
 * Created by hong on 2016. 5. 2..
 */

var express = require('express');
var router = express.Router();
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if(user.authId === id) {
      done(null, user);
    }
  }
});

var users = [
  {
    authId: 'local:egoing',
    id: 1,
    username: 'egoing',
    salt: '4WMGuG3Agk45vmMSHCtAh/LmeJAlj7+puosnZgDODL4pwL1MJE84yz2Fkz2Iv1WSjuhJk7xGGy/RYZb9zG/d7A==',
    password: 'oxGKthNHGxGWOxoukbYsYjXB4fBxErFtEvhmpX+JVZdvB+TAQARo4qwjaUEwiAnU3eZNW+yfZMMiwluiiYjgVPgtorfHEG8ePF0XKAu8QMQlc5pJd3fHt3mqINEZn/HDJxCyu7tvHl0YaSIepAz8Vw47sakBskN30FR+nrLsbDw=',
    displayName: 'Egoing'
  },
  {
    authId: 'local:kevin',
    id: 2,
    username: 'kevin',
    salt: 'ksMykMaEvPTO5nW8PPDdEuiH05bcijw/W8JsV0nOKhJ946H+SVXlttQKmIG7d4qZ3rDU6EWB3V9oLbPhQutUPA==',
    password: 'Hndgvkqv7R6JqpAWBiwshFq4mWJpNoe+qEPcD0LXywZeph/hJXUtdOWoQ30hrs5G5hrbp9oQrHmfbBJMuzHxlsKCc6cxD+6/vm9G86e86mcjN17b1dxyb47tGzQBI53FymoVeOyCaa5l4eIVK6e0q+lG0DZjQnG5BjXR29ODStc=',
    displayName: 'Kevin'
  }
];

passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;

    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if(uname === user.username) {
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
          if(hash === user.password) {
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));

router.get('/login', function(req, res) {
  res.render("login");
});

router.post(
  '/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/login',
      failureFlash: false
    }
  )
);

module.exports = router;