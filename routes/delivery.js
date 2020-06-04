var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var models = require('../models');
var { check, validationResult } = require('express-validator');

// 바이크다 주문 API Document
router.get('/', function( req, res, next ) {
  res.render('delivery', { title: 'Bikeda 주문 API' });
});

// 바이크다 배달 전체 목록
router.get('/deliveries', util.isLoggedin, function( req, res, next ) {
  models.delivery.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 배달 조회(  )
router.get('/delivery', util.isLoggedin, function( req, res, next ) {
  var reqParam      = req.query || '';
  var stoBrcofcId   = reqParam.stoBrcofcId || '';
  var stoId         = reqParam.stoId || '';
  var riderBrcofcId = reqParam.riderBrcofcId || '';
  var riderId       = reqParam.riderId || '';
  var dlvryRecvDt   = reqParam.dlvryRecvDt || '';
  var dlvryStateCd  = reqParam.dlvryStateCd || '';

  var query = 'select * from tb_deliveries where 1=1 ';
  if( stoBrcofcId )   query += 'and stoBrcofcId = ' + stoBrcofcId;
  if( stoId )         query += 'and stoId = ' + stoId;
  if( riderBrcofcId ) query += 'and riderBrcofcId = ' + riderBrcofcId;
  if( riderId )       query += 'and riderId = ' + riderId;
  if( dlvryRecvDt )   query += 'and date_format(dlvryRecvDt, "%Y%m%d") = ' + dlvryStateCd;
  if( dlvryStateCd )  query += 'and dlvryStateCd = ' + dlvryStateCd;

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 배달 등록
router.post('/delivery', util.isLoggedin, [
  check('stoBrcofcId','상점 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('dlvryCusTelno','고객 전화 번호는 필수 입력 입니다. (-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('dlvryCusAdres','고객 주소는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('dlvryCusRoadAdres','고객 도로명 주소는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('dlvryCusLa','위도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('dlvryCusLo','경도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('dlvryPaySeCd','결제 구분 코드는(01: 현금, 02:카드, 03:선결제)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02','03']),
  check('dlvryFoodAmnt','음식 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric(),
  check('dlvryAmnt','배달 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric(),
  check('dlvryPickReqTm','픽업 요청 시간은 필수 입력 입니다. 초단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric(),
  check('dlvryRecvDt','요청 일시는 필수 입력 입니다. YYYYMMDDHHMMSS 형식으로 입력해 주세요.(ex : 19001231235959)').exists().bail().notEmpty().isNumeric().bail().isLength({min:14, max:14}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/),
  check('dlvryDsptcDt','배차 일시는 YYYYMMDDHHMMSS 형식으로 입력해 주세요.(ex : 19001231235959)').optional().notEmpty().isNumeric().bail().isLength({min:14, max:14}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/),
  check('dlvryPickDt','픽업 일시는 YYYYMMDDHHMMSS 형식으로 입력해 주세요.(ex : 19001231235959)').optional().notEmpty().isNumeric().bail().isLength({min:14, max:14}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/),
  check('dlvryTcDt','배달 일시는 YYYYMMDDHHMMSS 형식으로 입력해 주세요.(ex : 19001231235959)').optional().notEmpty().isNumeric().bail().isLength({min:14, max:14}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/),
  check('dlvryDstnc','배달 거리는 필수 입력 입니다. Km 단위로 소수점 2자리까지 입력 가능합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('dlvryStateCd','상태 코드는(01: 요청, 02: 배차, 03: 배달중, 04: 배달완료, 05: 취소)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02','03','04','05'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 배달 번호 생성
  var query = 'select cast( concat("' + data.stoId + '","O", date_format(now(), "%Y%m%d"), lpad( concat( ifnull( max( cast( substr( dlvryNo, 15 ) AS unsigned ) ) , 0 ) + 1 ), 5, "0" ) ) as char ) as dlvryNo from tb_deliveries';
  var dlvryNo = '';
  models.sequelize.query( query ).spread( function ( result, metadata ) {
    data.dlvryNo = result[0].dlvryNo;
    models.delivery.create( data ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }, function ( err ) {
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
  check('riderCallDelayTime','콜 지연 시간은 초단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric(),
  check('riderStateCd','상태 코드는(01: 정상, 02:해지, 03:휴무)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02','03'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var riderId = data.riderId;
  delete data.riderId;
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

// 바이크다 라이더 포인트 조회( 라이더 ID, 포인트 구분 코드 )
router.get('/rider-point', util.isLoggedin, [
  check('riderId','라이더 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var riderId      = reqParam.riderId || '';
  var pointSeCd     = reqParam.pointSeCd || '';

  var where = {}
  where.riderId = riderId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.rider_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 라이더 포인트 등록
router.post('/rider-point', util.isLoggedin, [
  check('riderId','라이더 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('pointAmnt','포인트 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('pointNote','포인트 내용이 입력 되지 않았습니다.').optional().notEmpty().bail()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.rider_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 라이더 위치 조회( 라이더 ID )
router.get('/rider-location', util.isLoggedin, [
  check('riderId','지점 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var riderId      = reqParam.riderId || '';

  var where = {}
  where.riderId = riderId;
  models.rider_location.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 라이더 위치 등록
router.post('/rider-location', util.isLoggedin, [
  check('riderId','지점 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('riderLa','위도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('riderLo','경도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 라이더 위치 등록 여부 검증
  models.rider_location.findOne( { where : { riderId: data.riderId } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 라이더 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.rider_location.create( data ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 라이더 위치 수정
router.put('/rider-location', util.isLoggedin, [
  check('riderId','지점 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('riderLa','위도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('riderLo','경도는 필수 입력 입니다. 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 라이더 위치 등록 여부 검증
  models.rider_location.findOne( { where : { riderId: data.riderId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 라이더 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.rider_location.update( data, { where : { riderId: data.riderId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
module.exports = router;
