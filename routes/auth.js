var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var models = require('../models');
var { check, validationResult } = require('express-validator');

// 관리자 로그 인증 및 토큰생성
router.post('/admin', [
  check('stoLo').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('adminId').exists().bail().notEmpty(),
  check('adminPassword').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var payload = {
    id : req.body.adminId
  };
  var secretOrPrivateKey = process.env.JWT_SECRET;
  var options = {expiresIn: 60*60*24};
  jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
    if(err) return res.status(400).json(util.successFalse(err));
    res.status(200).json(util.successTrue(token));
  })
});

// 지점 로그인 인증 및 토큰 생성
router.post('/branch', [
  check('brcofcBsnsRgnmb').exists().bail().notEmpty(),
  check('brcofcPassword').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.branch.findOne( { where : { brcofcBsnsRgnmb : req.body.brcofcBsnsRgnmb, brcofcPassword : req.body.brcofcPassword } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 사업자 번호 또는 비밀번호 오류' };
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

// 상점 로그인 인증 및 토큰 생성
router.post('/store', [
  check('stoBsnsRgnmb').exists().bail().notEmpty(),
  check('stoPassword').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.store.findOne( { where : { stoBsnsRgnmb : req.body.stoBsnsRgnmb, stoPassword : req.body.stoPassword } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 사업자 번호 또는 비밀번호 오류' };
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
  check('riderCelno').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.rider.findOne( { where : { riderCelno : req.body.riderCelno } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 라이더 정보' };
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
  check('adminId').exists().bail().notEmpty(),
  check('adminPassword').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var payload = {
    id : req.body.adminId
  };
  var secretOrPrivateKey = process.env.JWT_SECRET;
  var options = {expiresIn: 60*60*24};
  jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
    if(err) return res.status(400).json(util.successFalse(err));
    res.status(200).json(util.successTrue(token));
  })
});

// 지점 인증 토큰 재생성
router.post('/re-branch', [
  check('brcofcBsnsRgnmb').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.branch.findOne( { where : { brcofcBsnsRgnmb : req.body.brcofcBsnsRgnmb } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 사업자 번호' };
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
  check('stoBsnsRgnmb').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.store.findOne( { where : { stoBsnsRgnmb : req.body.stoBsnsRgnmb } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 사업자 번호' };
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
  check('riderCelno').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.rider.findOne( { where : { riderCelno : req.body.riderCelno } } ).then( result => {
    if( !result ){
      var errors = { msg: '존재 하지 않는 라이더 정보' };
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
