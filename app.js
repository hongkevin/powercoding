var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var books = require('./routes/books');
//var proposals = require('./routes/proposals');

var newsfeed = require('./routes/ejsnewsfeed');
var mdlist = require('./routes/ejsmdlist');
var pglist = require('./routes/ejspglist');
var auth = require('./routes/auth');

var app = express();

app.use(session({
  secret: 'djfivjdFDjfh1@1@$ei%#213#',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    database: 'test'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// 유저(일반, 모델, 작가) 조회, 가입,
app.use('/api/1/users', users);
// 사진첩 생성, 전체조회, 특정조회, 수정, 삭제
app.use('/api/1/books', books);
// 요청서 생성, 리스트 조회, 특정조회, 수정
//app.use('/api/1/proposals', proposals);

// 뉴스피드 front-end
app.use('/newsfeed', newsfeed);
// 모델리스트 front-end
app.use('/mdlist', mdlist);
// 작가리스트 front-end
app.use('/pglist', pglist);
// 로그인 front-end
app.use('/auth', auth);


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


//passport.serializeUser(function(user, done) {
//  done(null, user.authId);
//});
//
//passport.deserializeUser(function(id, done) {
//  for (var i = 0; i < users.length; i++) {
//    var user = users[i];
//    if(user.authId === id) {
//      done(null, user);
//    }
//  }
//});

//passport.use(new LocalStrategy(
//  function(username, password, done) {
//    var uname = username;
//    var pwd = password;
//
//    for (var i = 0; i < users.length; i++) {
//      var user = users[i];
//      if(uname === user.username) {
//        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
//          if(hash === user.password) {
//            done(null, user);
//          } else {
//            done(null, false);
//          }
//        });
//      }
//    }
//    done(null, false);
//  }
//));

passport.use(new FacebookStrategy({
    clientID: '2925359214154649',
    clientSecret: '0966dbedda54bbafe984f7e12bcd0c40',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;

    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (user.authId === authId) {
        return done(null, user);
      }
    }

    var newuser = {
      'authId'      : authId,
      'displayName' : profile.displayName
    };
    users.push(newuser);
    done(null, newuser);
  }
));



//app.post(
//  '/auth/login',
//  passport.authenticate(
//    'local',
//    {
//      successRedirect: '/welcome',
//      failureRedirect: '/auth/login',
//      failureFlash: false
//    }
//  )
//);

app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook'
  )
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);

//app.get('/auth/login', function(req, res) {
//  var output = `
//  <h1>Login</h1>
//  <form action='/auth/login' method='post'>
//    <p>
//    <input type='text' name='username' placeholder='useranme'>
//    </p>
//    <p>
//    <input type='password' name='password' placeholder='password'>
//    </p>
//    <p>
//    <input type="submit">
//    </p>
//    </form>
//    <a href="/auth/facebook">facebook</a>
//  `;
//  res.send(output);
//});

app.get('/welcome', function(req, res) {
  if (req.user && req.user.displayName) {
    res.send(`
  <h1>Hello, ${req.user.displayName}<h1>
    <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
  <h1>Welcome</h1>
    <a href="/auth/login">Login</a>
    `);
  }
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  req.session.save(function() {
    res.redirect('/welcome');
  })
});

app.post('/auth/register', function(req, res) {
  hasher({password:req.body.password}, function(err, pass, salt, hash) {
    var user = {
      authId      : 'local:'+req.body.username,
      username    : req.body.username,
      salt        : salt,
      password    : hash,
      displayName : req.body.displayName
    };
    users.push(user);

    req.login(user, function(err) {
      req.session.save(function() {
        req.redirect('/welcome');
      });
    });
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
