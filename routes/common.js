var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var mysqlConnect = require('../mysqlConnect');
var { check, validationResult } = require('express-validator');

// 시도
router.get('/sido', util.isLoggedin, function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('common', 'sido', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 시군구
router.get('/sigungu', util.isLoggedin, [
  check('sdCd','시도 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 2, max: 2 })
],function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('common', 'sigungu', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 읍면동
router.get('/emd', util.isLoggedin, [
  check('sdCd','시도 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 2, max: 2 }),
  check('sggCd','시군구 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 3, max: 3 })
],function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('common', 'emd', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 리
router.get('/ri', util.isLoggedin, [
  check('sdCd','시도 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 2, max: 2 }),
  check('sggCd','시군구 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 3, max: 3 }),
  check('emdCd','읍면동 구분 코드는 필수 입력입니다.').exists().bail().notEmpty().bail().isLength({ min: 3, max: 3 })
],function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('common', 'ri', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});
module.exports = router;
