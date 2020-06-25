var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

// 바이크다 상점 API Document
router.get('/', function( req, res, next ) {
  res.render('store', { title: 'Bikeda Store API' });
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
router.post('/store', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoBsnsRgnmb','사업자 등록 번호는 필수 입력 입니다. (-)를 제외한 10자리 숫자를 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('stoPassword','비밀번호는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoMtlty','상호는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoBizSeCd','사업자 구분 코드는 (01: 개인 사업자, 02: 법인 사업자)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('stoRprsntvNm','대표자명은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoBrdYmd','대표자 생년월일은 필수 입력 입니다. YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').if(check('stoBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoCrprtRgnmb','법인 등록 번호는 필수 입력 입니다. (-)를 제외한 13자리 숫자를 입력해 주세요.').if(check('stoBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('stoOpnngYmd','개업년월일은 필수 입력 입니다. YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoBsnsPlaceAdres','사업장 주소는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoBizcnd','업태는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoInduty','업종은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('stoTelno','연락처는 필수 입력 입니다. (-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('stoSetSeCd','설정 구분 코드는 (01: 거리, 02: 지역)으로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('stoNightSrchrApplyYn','야간 할증 적용 여부는 (Y , N)으로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['Y','N']),
  check('stoNightSrchrStdTm','야간 할증 시작 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrEndTm','야간 할증 종료 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrAmnt','야간 할증 수수료 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('stoLa','위도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo','경도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoStateCd','상태 코드는(01: 계약, 02:해지)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoBsnsRgnmb: data.stoBsnsRgnmb } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 사업자 등록 번호 입니다."};      errors.errors= error;
      return res.status(400).json( util.successFalse( error ) );
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
router.put('/store', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').optional().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoBsnsRgnmb','사업자 번호는 (-)를 제외한 10자리 숫자를 입력해 주세요.').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('stoPassword','비밀번호가 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoMtlty','상호가 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoBizSeCd','사업자 구분 코드는 (01: 개인 사업자, 02: 법인 사업자)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('stoRprsntvNm','대표자명이 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoBrdYmd','대표자 생년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').if(check('stoBizSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoCrprtRgnmb','법인 등록 번호는 (-)를 제외한 13자리 숫자를 입력해 주세요.').if(check('stoBizSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('stoOpnngYmd','개업 생년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231).').optional().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoBsnsPlaceAdres','사업장 주소가 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoBizcnd','업태가 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoInduty','업종이 입력 되지 않았습니다.').optional().notEmpty(),
  check('stoTelno','연락처는 (-)를 제외한 숫자로 입력해 주세요.').optional().notEmpty().isNumeric(),
  check('stoSetSeCd','설정 구분 코드는 (01: 거리, 02: 지역)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('stoNightSrchrApplyYn','야간 할증 적용 여부는 (Y , N)으로 입력해 주세요.').optional().notEmpty().bail().isIn(['Y','N']),
  check('stoNightSrchrStdTm','야간 할증 시작 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrEndTm','야간 할증 종료 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrAmnt','야간 할증 수수료 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('stoLa','위도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo','경도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoStateCd','상태 코드는(01: 계약, 02:해지)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var stoId = data.stoId;
  delete data.stoId;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "존재 하지 않는 상점 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store.update( data, { where : { stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 포인트 조회( 상점 ID, 포인트 구분 코드 )
router.get('/store-point', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId      = reqParam.stoId || '';
  var pointSeCd  = reqParam.pointSeCd || '';

  var where = {};
  where.stoId = stoId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.branch_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 포인트 등록
router.post('/store-point', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('pointAmnt','포인트 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('pointNote','포인트 내용이 입력 되지 않았습니다.').optional().notEmpty().bail()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.branch_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 조회( 상점 ID, 할증 구분 코드 )
router.get('/store-surcharge', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd','포인트 구분 코드는(01: 비, 02: 눈, 03: 결빙, 04: 기타)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02','03','04'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId      = reqParam.stoId || '';
  var srchrSeCd  = reqParam.srchrSeCd || '';

  var where = {};
  where.stoId = stoId;
  if( srchrSeCd ) where.srchrSeCd = srchrSeCd;
  models.store_surcharge.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 등록
router.post('/store-surcharge', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd','할증 구분 코드는(01: 비, 02: 눈, 03: 결빙, 04: 기타)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02','03','04']),
  check('srchrAmnt','할증 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric(),
  check('srchrApplyYn','할증 적용 여부는 (Y , N)으로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['Y','N'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store_surcharge.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 수정
router.put('/store-surcharge', util.isLoggedin, [
  check('srchrSeqNo','할증 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd','할증 구분 코드는(01: 비, 02: 눈, 03: 결빙, 04: 기타)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02','03','04']),
  check('srchrAmnt','할증 금액은 원단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric(),
  check('srchrApplyYn','할증 적용 여부는 (Y , N)으로 입력해 주세요.').optional().notEmpty().bail().isIn(['Y','N'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var srchrSeqNo = data.srchrSeqNo;
  var stoId = data.stoId;

  delete data.srchrSeqNo;
  delete data.stoId;

  // 상점 할증 등록 여부 검증
  models.store_surcharge.findOne( { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 할증 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_surcharge.update( data, { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 삭제
router.delete('/store-surcharge', util.isLoggedin, [
  check('srchrSeqNo','할증 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var srchrSeqNo = req.body.srchrSeqNo;
  var stoId = req.body.stoId;

  // 상점 할증 등록 여부 검증
  models.store_surcharge.findAll( { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 할증 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_surcharge.destroy( { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 조회( 상점 ID, 할증 구분 코드 )
router.get('/store-distance', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {};
  where.stoId = stoId;
  models.store_distance_setting.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 등록
router.post('/store-distance', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setStdDstnc','시작 거리는 필수 입력 입니다. Km 단위로 소수점 2자리까지 입력 가능합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setEndDstnc','종료 거리는 필수 입력 입니다. Km 단위로 소수점 2자리까지 입력 가능합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setAmnt','설정 금액은 필수 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store_distance_setting.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 수정
router.put('/store-distance', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setStdDstnc','시작 거리는 Km 단위로 소수점 2자리까지 입력 가능합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setEndDstnc','종료 거리는 Km 단위로 소수점 2자리까지 입력 가능합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setAmnt','설정 금액은 원단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_distance_setting.findOne( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 거리 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_distance_setting.update( data, { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 삭제
router.delete('/store-distance', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_distance_setting.findAll( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 거리 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_distance_setting.destroy( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 지역 설정 조회( 상점 ID )
router.get('/store-area', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {};
  where.stoId = stoId;
  models.store_area_setting.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 지역 설정 등록
router.post('/store-area', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setSdCd','시,도 코드는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric(),
  check('setSggCd','시,군,구 코드는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric(),
  check('setEmdCd','읍,면,동 코드는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric(),
  check('setRiCd','리 코드는 필수 입력 입니다.').optional().notEmpty().bail().isNumeric(),
  check('setAmnt','설정 금액은 필수 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store_area_setting.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 지역 설정 수정
router.put('/store-area', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setSdCd','시,도 코드가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('setSggCd','시,군,구 코드가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('setEmdCd','읍,면,동 코드가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('setRiCd','리 코드가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('setAmnt','설정 금액은 원단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 지역 설정 등록 여부 검증
  models.store_area_setting.findOne( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 지역 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_area_setting.update( data, { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 삭제
router.delete('/store-area', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_area_setting.findAll( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 지역 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_area_setting.destroy( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 특별 설정 조회( 상점 ID )
router.get('/store-special', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {};
  where.stoId = stoId;
  models.store_special_setting.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특별 설정 등록
router.post('/store-special', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setAmnt','설정 금액은 필수 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store_special_setting.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특수 설정 수정
router.put('/store-special', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setAmnt','설정 금액은 원단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 특수 설정 등록 여부 검증
  models.store_special_setting.findOne( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 특수 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_special_setting.update( data, { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특수 설정 삭제
router.delete('/store-special', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 특수 설정 등록 여부 검증
  models.store_special_setting.findAll( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 특수 설정 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_special_setting.destroy( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 특별 좌표 조회( 설정 일련번호, 상점 ID )
router.get('/store-location', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {};
  where.stoId = stoId;
  models.store_special_location.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특별 좌표 등록
router.post('/store-location', util.isLoggedin, [
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('lctnLa','위도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('lctnLo','경도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  models.store_special_location.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특수 좌표 수정
router.put('/store-location', util.isLoggedin, [
  check('lctnSeqNo','좌표 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('lctnLa','위도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('lctnLo','경도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var lctnSeqNo = data.lctnSeqNo;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.lctnSeqNo;
  delete data.setSeqNo;
  delete data.stoId;

  // 상점 특수 설정 등록 여부 검증
  models.store_special_location.findOne( { where : { lctnSeqNo: lctnSeqNo, setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 특수 좌표 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_special_location.update( data, { where : { lctnSeqNo: lctnSeqNo, setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 상점 특수 좌표 삭제
router.delete('/store-location', util.isLoggedin, [
  check('lctnSeqNo','좌표 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('setSeqNo','설정 일련번호는 필수 입력 입니다.').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  var data = req.body;
  var lctnSeqNo = data.lctnSeqNo;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.lctnSeqNo;
  delete data.setSeqNo;
  delete data.stoId;

  // 상점 특수 좌표 등록 여부 검증
  models.store_special_location.findAll( { where : { lctnSeqNo : lctnSeqNo, setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 특수 좌표 정보 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.store_special_location.destroy( { where : { lctnSeqNo : lctnSeqNo, setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
module.exports = router;
