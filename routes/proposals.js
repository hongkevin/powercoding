///**
// * Created by hong on 2016. 4. 26..
// */
//var express = require('express');
//var router = express.Router();
//
///* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});
//
///* proposals(제안서) 생성(POST, INSERT) */
//// moca.com/api/1/proposals
//router.post('/', function(req, res, next) {
//  var data = {
//    'date'    : req.body.date,
//    'time'    : req.body.time,
//    'address' : req.body.address,
//    'conceptA': req.body.conceptA,
//    'conceptB': req.body.conceptB,
//    'hourA'   : req.body.hourA,
//    'hourB'   : req.body.hourB,
//    'inandout': req.body.inandout,
//    'etc'     : req.body.etc
//  }
//
//  client.query('INSERT * into proposals SET ?', data, function(err, rows, fields) {
//    if (err) {
//      conosole.log(err);
//    }
//    res.status(200);
//  });
//});
//
//router.get('/:prop_id', function(req, res, next) {
//  var prop_id = req.params.prop_id;
//
//  client.query('SELECT * FROM proposals WHERE id = ?', prop_id, function(err, rows, fields) {
//    if (err) {
//      console.log(err);
//    }
//    var proposal = [];
//    rows.forEach(function (row) {
//      proposal.push({
//        id : row.date,
//        time : row.time,
//        address : row.address,
//
//      })
//    })
//  })
//})
//
//module.exports = router;
//
//var user_id = req.params.user_id;
//
//client.query('SELECT * FROM user WHERE id = ?', user_id, function(err, rows, fields) {
//  if (err) {
//    console.log(err);
//  }
//
//  var user = [];
//  rows.forEach(function(row) {
//    user.push({
//      id        : row.id,
//      username  : row.username,
//      address   : row.address,
//      price     : row.price,
//      user_type : row.user_type
//    });
//  });
//  res.json({user:user});