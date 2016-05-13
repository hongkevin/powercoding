/**
 * Created by hong on 2016. 4. 28..
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

router.get('/', function(req, res, next) {
    client.query('SELECT * FROM user WHERE user_type = "M"', function (err, rows, fields) {
      if(err) {
        console.log(err);
      }

      var users = [];
      rows.forEach(function(row) {
        users.push({
          id        : row.id,
          username  : row.username,
          address   : row.address,
          price     : row.price,
          user_type : row.user_type
        });
      });
      res.render("mdlist", {users: users});
    });
});

module.exports = router;