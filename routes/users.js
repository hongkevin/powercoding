/**
 * Created by hong on 2016. 4. 26..
 */

var express = require('express')
  , router = express.Router()
  , mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

/* 모델/작가 리스트 조회(select) - user_type: M(모델), P(작가) +++ 나중에 시간되면 쿼리스트링 더 넣어서 필터도 만들기!!! */
// moca.com/api/1/users?user_type=M
router.get('/', function(req, res, next) {
  var user_type = req.query.user_type;

  if (user_type == 'P' || 'M' ) {
    client.query('SELECT * FROM user WHERE user_type = ?', user_type, function (err, rows, fields) {
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
      res.json({users: users});
    });
  }
});

/* users 생성(회원가입, insert) */
// moca.com/api/1/users?username=Chris
router.post('/', function(req, res, next) {
  var data = {
    'username': req.body.username,
    'address' : req.body.address,
    'price'   : req.body.price
  }

  client.query('INSERT * into user SET ?', data, function(err, rows, fields) {
    if (err) {
      conosole.log(err);
    }
    res.status(200);
  });
});

/* 특정 유저 프로필 조회(:id 기준) */
// moca.com/api/1/users/2
router.get('/:user_id', function(req, res, next) {
  var user_id = req.params.user_id;

  client.query('SELECT * FROM user WHERE id = ?', user_id, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }

    var user = [];
    rows.forEach(function(row) {
      user.push({
        id        : row.id,
        username  : row.username,
        address   : row.address,
        price     : row.price,
        user_type : row.user_type
      });
    });
    res.json({user:user});
  });
});

router.get('/:user_id/details', function(req, res, next) {
  var user_id = req.params.user_id;

  client.query('SELECT * FROM user WHERE id = ?', user_id, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }

    var user = [];
    rows.forEach(function(row) {
      user.push({
        id        : row.id,
        username  : row.username,
        address   : row.address,
        price     : row.price,
        age       : row.age,
        gender    : row.gender,
        job       : row.job,
        intro     : row.intro,
        img_thumb : row.img_thumb,
        user_type : row.user_type
      });
    });
    res.json({user:user});
  });
});


/* 모델/작가 등록하기 & 정보수정하기 - 가입하기와 다름. 이들은 가입을 했기 때문에 user_id를 발급받았음 */
// moca.com/api/1/users/2?user_type=M
router.put('/:user_id', function(req, res, next) {
  var user_id = req.params.user_id;
  var user_type = req.query.user_type;

  client.query('UPDATE user SET user_type = ? WHERE id = ?', [user_type, user_id], function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
  });
});

///* 전체 유저 조회 - 나중에 admin 만들 때 활용 */
//// moca.com/api/1/users
//router.get('/', function(req, res, next) {
//  var user_type = req.query.user_type;
//
//  client.query('SELECT * FROM user WHERE user_type = ?', user_type, function (err, rows, fields) {
//    if(err) {
//      console.log(err);
//    }
//
//    var users = [];
//    rows.forEach(function(row) {
//      users.push({
//        id        : row.id,
//        username  : row.username,
//        address   : row.address,
//        price     : row.price,
//        user_type : row.user_type
//      });
//    });
//    res.json({users: users});
//  });
//});

module.exports = router;
