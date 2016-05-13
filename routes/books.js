/**
 * Created by hong on 2016. 4. 26..
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

/* books 전체에 대한 조회(select) */
router.get('/', function(req, res, next) {
  client.query('SELECT b.id AS books_id, b.username AS books_username, b.user_type AS books_usertype, b.like_count AS books_like, b.intro AS books_intro,  i.img_url AS img_url FROM books b JOIN img_url i ON b.img_url1 = i.id', function (err, rows, fields) {
    if(err) {
      console.log(err);
    }

    var books = [];
    rows.forEach(function(row) {
      books.push({
        id       : row.books_id,
        username : row.books_username,
        usertype : row.books_usertype,
        like     : row.books_like,
        intro    : row.books_intro,
        img_url  : row.img_url
      });
    });
    res.json({books: books});
  });
});

/* 특정 사진첩 조회(:id 기준) */
// moca.com/api/1/books/2
router.get('/:book_id', function(req, res, next) {
  var book_id = req.params.book_id;

  client.query('SELECT b.id AS books_id, b.username AS books_username, b.like_count AS books_like, i.img_url AS img_url FROM books b JOIN img_url i ON b.id = i.book_id WHERE b.id = ?', book_id, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }

    var book = [];
    rows.forEach(function(row) {
      book.push({
        id       : row.books_id,
        username : row.books_username,
        like     : row.books_like,
        img_url  : row.img_url
      });
    });
    res.json({book:book});
  });
});

/* books 생성(사진업로드, insert) */
// moca.com/api/1/books
//router.post('/', function(req, res, next) {
//  // ejs에서 multi image file upload를 받고
//  // S3에 저장하고 그 저장한 사진들의 URL을 가져와서
//  // DB에 넣고 각 데이터들을 뽑아서 넣어두기
//  var data = {
//    'username': req.body.username,
//    'img_url' : ,
//    'price'   : req.body.price
//  }
//
//  client.query('INSERT * into user SET ?', data, function(err, rows, fields) {
//    if (err) {
//      conosole.log(err);
//    }
//    res.status(200);
//  });
//});

//// multer image upload
//var storage = multer.diskStorage({
//  destination: function(req, file, callback) {
//    callback(null, './uploads');
//  },
//  filename: function (req, file, callback) {
//    callback(null, file.fieldname + '-' + Date.now());
//  }
//});
//
//var upload = multer({storage : storage}).array('userPhoto', 10);
//
//app.get('/upload', function(req, res) {
//  res.sendFile(__dirname + "/upload.html");
//});
//
//app.post('/api/v1/photos', function(req, res) {
//  upload(req, res, function(err) {
//    if(err) {
//      return res.end("Error uploading file.");
//    }
//    res.end("File is uploaded");
//  });
//});

///* users 생성(회원가입, insert) */
//// moca.com/api/1/users?username=Chris
//router.post('/', function(req, res, next) {
//  var data = {
//    'username': req.body.username,
//    'address' : req.body.address,
//    'price'   : req.body.price
//  }
//
//  client.query('INSERT * into user SET ?', data, function(err, rows, fields) {
//    if (err) {
//      conosole.log(err);
//    }
//    res.status(200);
//  });
//});

module.exports = router;