var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var store_valid = require('../validate/store');
var point_valid = require('../validate/store_point');
var share_valid = require('../validate/store_share');


// 바이크다 상점 API Document
router.get('/', function( req, res, next ) {
  res.render('store', { title: '바이크다 상점 API' });
});

// 바이크다 상점 전체 목록
router.get('/stores', util.isLoggedin, function( req, res, next ) {
  models.store.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 조회( 사업자 등록번호, 상점명, 상호, 대표자명 )
router.get('/store', util.isLoggedin, function( req, res, next ) {
  var reqParam = req.query || '';
  var brcofcId     = reqParam.brcofcId || '';
  var stoBsnsRgnmb = reqParam.stoBsnsRgnmb || '';
  var stoMtlty     = reqParam.stoMtlty || '';
  var stoRprsntvNm = reqParam.stoRprsntvNm || '';

  var query = 'select * from tb_stores where 1=1 ';
  if( brcofcId )     query += 'and brcofcId like "%' + brcofcId + '%" ';
  if( stoBsnsRgnmb ) query += 'and stoBsnsRgnmb like "%' + stoBsnsRgnmb + '%" ';
  if( stoMtlty )     query += 'and stoMtlty like "%' + stoMtlty + '%" ';
  if( stoRprsntvNm ) query += 'and stoRprsntvNm like "%' + stoRprsntvNm + '%" ';

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 등록
router.post('/store', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = store_valid.create.validate( req.body );
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoBsnsRgnmb: data.stoBsnsRgnmb } } ).then( result => {
    if( result ) {
      validationError.errors.already = {message:'이미 등록된 상점 사업자 등록 번호. stoBsnsRgnmb : ' + stoBsnsRgnmb };
      return res.status(400).json( util.successFalse( validationError) );
    }
    // 상점 ID 생성
    var query = "select cast( concat('S', lpad( concat( ifnull( max( cast( substr( stoId, 2 ) AS unsigned ) ) , 0 ) + 1 ), 4, '0' ) ) as char ) as stoId from tb_stores";
    var stoId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      data.stoId = result[0].stoId;
      models.store.create( data ).then( result => {
        return res.status(201).json( util.successTrue( result ) );
      }).catch( err => {
        return res.status(400).json( util.successFalse( err ) );
      });
    }, function ( err ) {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 수정
router.put('/store', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = store_valid.update.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  delete data.stoId;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoId: req.body.stoId } } ).then( result => {
    if( !result ) {
      validationError.errors.notfound = { message:'존재하지 않는 상점 ID. stoId : ' + stoId };
      return res.status(400).json( util.successFalse( validationError) );
    }
    models.store.update( data, { where : { stoId: req.body.stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 포인트 조회( 상점 ID, 포인트 구분 코드 )
router.get('/store-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  var reqParam   = req.query || '';
  var stoId      = reqParam.stoId || '';
  var pointSeCd  = reqParam.pointSeCd || '';

  if( !stoId ) {
    validationError.errors.validate = { message:'상점 ID는 필수 입니다.' };
    return res.status(400).json( util.successFalse( validationError) );
  }
  var where = {}
  where.stoId = stoId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.store_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 포인트 등록
router.post('/store-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = point_valid.create.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  models.store_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});


module.exports = router;
