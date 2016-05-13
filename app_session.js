/**
 * Created by hong on 2016. 4. 27..
 */
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
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

app.get('/count', function(req, res) {
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});

app.get('/tmp', function(req, res) {
  res.send('result : '+req.session.count);
});

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

//app.post('/auth/login', function(req, res) {
//  var user = {
//    username: 'kevin',
//    password: '1234',
//    displayName: 'kevin hong'
//  };
//
//  var uname = req.body.username;
//  var pwd = req.body.password;
//
//  if(uname === user.username && pwd === user.password) {
//    req.session.displayName = user.displayName;
//    req.session.save(function() {
//      res.redirect('/welcome');
//    });
//  } else {
//    res.send('Who are you? <a href="/auth/login">login</a>');
//  }
//});

app.get('/auth/logout', function(req, res) {
  delete req.session.displayName;
  req.session.save(function() {
    res.redirect('/welcome');
  });
});

app.get('/welcome', function(req, res) {
  if (req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}<h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>
    `);
  }
});

app.get('/auth/login', function(req, res) {
  var output = `
  <h1>Login</h1>
  <form action='/auth/login' method='post'>
    <p>
      <input type='text' name='username' placeholder='useranme'>
    </p>
    <p>
      <input type='password' name='password' placeholder='password'>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

app.listen(3003, function() {
  console.log('Connected 3003 port!!!');
});