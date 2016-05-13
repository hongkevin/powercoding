var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  client.query('SELECT b.id AS books_id, b.username AS books_username, i.img_url AS img_url FROM books b JOIN img_url i ON b.img_url1 = i.id', function (err, rows, fields) {
    if(err) {
      console.log(err);
    }

    var books = [];
    rows.forEach(function(row) {
      books.push({
        id       : row.books_id,
        username : row.books_username,
        img_url  : row.img_url
      });
    });
    res.render("index", {books: books});
  });
});

module.exports = router;
