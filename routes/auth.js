var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var models = require('../models');
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
  var payload = {
    id : req.body.adminId
  };
  var secretOrPrivateKey = process.env.JWT_SECRET;
  var options = {expiresIn: 60*60*24};
  jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
    if(err) return res.status(400).json(util.successFalse(err));
    res.status(200).json(util.successTrue(token));
  });
});

// 지점 로그인 인증 및 토큰 생성
router.post('/branch', [
  check('adminId', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('adminPassword', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  var where = {};
  where.adminId = req.body.adminId;
  where.adminPassword = req.body.adminPassword;
  models.branch_account.findOne( { where : where } ).then( result => {
    if( !result ){
      var errors = { message: '관리자 ID 또는 비밀번호가 일치 하지 않습니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      adminId : result.adminId,
      brcofcId : result.brcofcId
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));

      var returnData = {};
      returnData.adminId = result.adminId;
      returnData.brcofcId = result.brcofcId;
      returnData.adminNm = result.adminNm;
      returnData.adminCelno = result.adminCelno;
      returnData.adminGradeCd = result.adminGradeCd;
      returnData.adminUseYn = result.adminUseYn;
      returnData.token = token;
      res.status(200).json(util.successTrue(returnData));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});

// 상점 로그인 인증 및 토큰 생성
router.post('/store', [
  check('stoBsnsRgnmb', '사업자 등록 번호 / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('stoPassword', '사업자 등록 번호 / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store.findOne( { where : { stoBsnsRgnmb : req.body.stoBsnsRgnmb, stoPassword : req.body.stoPassword } } ).then( result => {
    if( !result ){
      var errors = { message: '사업자 등록 번호 또는 비밀번호가 일치 하지 않습니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      stoBsnsRgnmb : result.stoBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});


// 랴이더 로그인 인증 및 토큰 생성
router.post('/rider', [
  check('riderCelno', '휴대전화 번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.rider.findOne( { where : { riderCelno : req.body.riderCelno } } ).then( result => {
    if( !result ){
      var errors = { message: '존재 하지 않는 휴대전화 번호 입니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      riderCelno : result.riderCelno
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});

// 관리자 인증 토큰 재생성
router.post('/re-admin', [
  check('adminId', 'ID는 필수 입력 입니다..').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  var payload = {
    id : req.body.adminId
  };
  var secretOrPrivateKey = process.env.JWT_SECRET;
  var options = {expiresIn: 60*60*24};
  jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
    if(err) return res.status(400).json(util.successFalse(err));
    res.status(200).json(util.successTrue(token));
  });
});

// 지점 인증 토큰 재생성
router.post('/re-branch', [
  check('brcofcBsnsRgnmb', '사업자 등록 번호는 필수 입력 입니다.').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.branch.findOne( { where : { brcofcBsnsRgnmb : req.body.brcofcBsnsRgnmb } } ).then( result => {
    if( !result ){
      var errors = { message: '존재 하지 않는 사업자 등록 번호 입니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      brcofcBsnsRgnmb : result.brcofcBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});

// 상점 인증 토큰 재생성
router.post('/re-store', [
  check('stoBsnsRgnmb', '사업자 등록 번호는 필수 입력 입니다.').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store.findOne( { where : { stoBsnsRgnmb : req.body.stoBsnsRgnmb } } ).then( result => {
    if( !result ){
      var errors = { message: '존재 하지 않는 사업자 등록 번호 입니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      stoBsnsRgnmb : result.stoBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});
// 라이더 인증 토큰 재생성
router.post('/re-rider', [
  check('riderCelno', '휴대전화 번호는 필수 입력 입니다.').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.rider.findOne( { where : { riderCelno : req.body.riderCelno } } ).then( result => {
    if( !result ){
      var errors = { message: '존재 하지 않는 휴대전화 번호 입니다.' };
      return res.status(400).json(util.successFalse(errors));
    }
    var payload = {
      riderCelno : result.riderCelno
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }).catch( err => {
    return res.status(400).json(util.successFalse(err));
  });
});
module.exports = router;
