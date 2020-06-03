var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var models = require('../models');
var { check, validationResult } = require('express-validator');

// 바이크다 라이더 API Document
router.get('/', function( req, res, next ) {
  res.render('rider', { title: 'Bikeda 라이더 API' });
});

// 바이크다 라이더 전체 목록
router.get('/riders', util.isLoggedin, function( req, res, next ) {
  models.rider.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 라이더 조회( 라이더 핸드폰번호, 라이더 명, 지점 ID )
router.get('/rider', util.isLoggedin, function( req, res, next ) {
  var reqParam = req.query || '';
  var riderCelno  = reqParam.riderCelno || '';
  var riderNm     = reqParam.riderNm || '';
  var brcofcId    = reqParam.brcofcId || '';

  var query = 'select * from tb_riders where 1=1 ';
  if( riderCelno ) query += 'and riderCelno like "%' + riderCelno + '%" ';
  if( riderNm )    query += 'and riderNm like "%' + riderNm + '%" ';
  if( brcofcId )   query += 'and brcofcId = ' + brcofcId + '" ';

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 라이더 등록
router.post('/rider', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('riderCelno','휴대전화 번호는 필수 입력 입니다. (-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('riderNm','라이더명은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('riderWthdrBankCd','출금 은행 코드는 3자리 숫자로 입력해 주세요.').optional().notEmpty().bail().isLength({ min: 3, max: 3 }),
  check('riderWthdrAcnt','출금 계좌가 입력 되지 않았습니다.').optional().notEmpty(),
  check('riderLoginYn','로그인 여부는 (Y , N)으로 입력해 주세요.').optional().notEmpty().isIn(['Y','N']),
  check('riderMinWthdrAmnt','최소 출금 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('riderCallLimit','콜 제한 수가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('riderCallDelayTime','콜 지연 시간은 초단위로 입력해 주세요.(ex : 000030).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 라이더 등록 여부 검증
  models.rider.findOne( { where : { riderCelno: data.riderCelno } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 라이더 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    // 라이더 ID 생성
    var query = "select cast( concat('R', lpad( concat( ifnull( max( cast( substr( riderId, 2 ) AS unsigned ) ) , 0 ) + 1 ), 5, '0' ) ) as char ) as riderId from tb_riders";
    var riderId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      data.riderId = result[0].riderId;
      models.rider.create( data ).then( result => {
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

// 바이크다 라이더 수정
router.put('/rider', util.isLoggedin, [
  check('riderId','라이더 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('brcofcId','지점 ID는 Bxxxx 형식으로 입력해 주세요.(ex : B0001)').optional().notEmpty().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('riderCelno','(-)를 제외한 숫자로 입력해 주세요.').optional().notEmpty().isNumeric(),
  check('riderNm','라이더명이 입력 되지 않았습니다.').optional().notEmpty(),
  check('riderWthdrBankCd','출금 은행 코드는 3자리 숫자로 입력해 주세요.').optional().notEmpty().bail().isLength({ min: 3, max: 3 }),
  check('riderWthdrAcnt','출금 계좌가 입력 되지 않았습니다.').optional().notEmpty(),
  check('riderLoginYn','로그인 여부는 (Y , N)으로 입력해 주세요.').optional().notEmpty().isIn(['Y','N']),
  check('riderMinWthdrAmnt','최소 출금 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('riderCallLimit','콜 제한 수가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('riderCallDelayTime','콜 지연 시간은 초단위로 입력해 주세요.(ex : 000030).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var brcofcId = data.brcofcId;
  delete data.brcofcId;
  // 라이더 등록 여부 검증
  models.rider.findOne( { where : { riderId: riderId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 라이더 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.rider.update( data, { where : { riderId: riderId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

module.exports = router;
