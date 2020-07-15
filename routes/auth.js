var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var mysqlConnect = require('../mysqlConnect');
var { check, validationResult } = require('express-validator');

// 바이크다 인증 API Document
router.get('/', function( req, res, next ) {
  res.render('auth', { title: 'Bikeda 인증 토큰(Auth Token) API' });
});

// 관리자 로그 인증 및 토큰생성
router.post('/admin', [
  check('adminId', 'ID / 비밀번호는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('adminPassword', 'ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('auth', 'adminLogin', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        adminId : json[0].adminId
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("관리자 ID 또는 비밀번호가 일치 하지 않습니다."));
    }
  });
});

// 지점 로그인 인증 및 토큰 생성
router.post('/branch', [
  check('adminId', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('adminPassword', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  console.log(req.body);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('auth', 'branchLogin', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        adminId : json[0].adminId,
        brcofcId : json[0].brcofcId
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("관리자 ID 또는 비밀번호가 일치 하지 않습니다."));
    }
  });
});

// 상점 로그인 인증 및 토큰 생성
router.post('/store', [
  check('stoBsnsRgnmb', '사업자 등록 번호 / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('stoPassword', '사업자 등록 번호 / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('auth', 'storeLogin', req.body, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        stoBsnsRgnmb : json[0].stoBsnsRgnmb
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("사업자 등록 번호 또는 비밀번호가 일치 하지 않습니다."));
    }
  });
});

// 랴이더 로그인 인증 및 토큰 생성
router.post('/rider', [
  check('riderCelno', '휴대전화 번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('auth', 'riderLogin', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        riderCelno : json[0].riderCelno
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("휴대전화 번호가 일치 하지 않습니다."));
    }
  });
});
module.exports = router;
