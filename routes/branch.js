var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: 'Bikeda 지점 API' });
});

// 바이크다 지점 전체 목록
router.get('/branches', util.isLoggedin, function( req, res, next ) {
  models.branch.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 조회( 사업자 등록번호, 지점명, 상호, 대표자명 )
router.get('/branch', util.isLoggedin, function( req, res, next ) {
  var reqParam = req.query || '';
  var brcofcBsnsRgnmb = reqParam.brcofcBsnsRgnmb || '';
  var brcofcNm        = reqParam.brcofcNm || '';
  var brcofcMtlty     = reqParam.brcofcMtlty || '';
  var brcofcRprsntvNm = reqParam.brcofcRprsntvNm || '';

  var query = 'select * from tb_branches where 1=1 ';
  if( brcofcBsnsRgnmb ) query += 'and brcofcBsnsRgnmb like "%' + brcofcBsnsRgnmb + '%" ';
  if( brcofcNm )        query += 'and brcofcNm like "%' + brcofcNm + '%" ';
  if( brcofcMtlty )     query += 'and brcofcMtlty like "%' + brcofcMtlty + '%" ';
  if( brcofcRprsntvNm ) query += 'and brcofcRprsntvNm like "%' + brcofcRprsntvNm + '%" ';

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, [
  check('brcofcBsnsRgnmb', '사업자 등록 번호는 필수 입력 입니다. (-)를 제외한 10자리 숫자를 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('brcofcPassword', '비밀번호는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcNm','지점명은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcMtlty','상호는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcBizSeCd','사업자 구분 코드는 (01: 개인 사업자, 02: 법인 사업자)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcRprsntvNm','대표자명은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcBrdYmd','대표자 생년월일은 필수 입력 입니다. YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').if(check('brcofcBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcCrprtRgnmb','법인 등록 번호는 필수 입력 입니다. (-)를 제외한 13자리 숫자를 입력해 주세요.').if(check('brcofcBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('brcofcOpnngYmd','개업년월일은 필수 입력 입니다. YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcBsnsPlaceAdres','사업장 주소는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcBizcnd','업태는 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcInduty','업종은 필수 입력 입니다.').exists().bail().notEmpty(),
  check('brcofcCelno','휴대전화 번호는 필수 입력 입니다. (-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('brcofcFeeSeCd','수수료 구분 코드는 (01: 정액제, 02: 정률제)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcFeeAmnt','수수료 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('brcofcFeeRate','수수료율은 필수 입력 입니다. 소수점 2자리까지 입력 가능 합니다.').if(check('brcofcFeeSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('brcofcStateCd','상태 코드는(01: 계약, 02:해지)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 지점 등록 여부 검증
  models.branch.findOne( { where : { brcofcBsnsRgnmb: data.brcofcBsnsRgnmb } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 사업자 등록 번호 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    // 지점 ID 생성
    var query = "select cast( concat('B', lpad( concat( ifnull( max( cast( substr( brcofcId, 2 ) AS unsigned ) ) , 0 ) + 1 ), 4, '0' ) ) as char ) as brcofcId from tb_branches";
    var brcofcId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      data.brcofcId = result[0].brcofcId;
      models.branch.create( data ).then( result => {
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

// 바이크다 지점 수정
router.put('/branch', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcBsnsRgnmb','사업자 번호는 (-)를 제외한 10자리 숫자를 입력해 주세요.').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('brcofcPassword','비밀번호가 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcNm','지점명이 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcMtlty', '상호가 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcBizSeCd','사업자 구분 코드는 (01: 개인 사업자, 02: 법인 사업자)로 입력해 주세요.' ).optional().notEmpty().bail().isIn(['01','02']),
  check('brcofcRprsntvNm','대표자명이 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcBrdYmd','대표자 생년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').if(check('brcofcBizSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcCrprtRgnmb','법인 등록 번호는 (-)를 제외한 13자리 숫자를 입력해 주세요.').if(check('brcofcBizSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('brcofcOpnngYmd','개업 생년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231).').optional().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcBsnsPlaceAdres','사업장 주소가 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcBizcnd','업태가 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcInduty','업종이 입력 되지 않았습니다.').optional().notEmpty(),
  check('brcofcCelno','휴대 전화 번호는 (-)를 제외한 숫자로 입력해 주세요.').optional().notEmpty().isNumeric(),
  check('brcofcFeeSeCd','수수료 구분 코드는 (01: 정액제, 02: 정률제)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('brcofcFeeAmnt','수수료 금액은 원단위로 입력해 주세요.').if(check('brcofcFeeSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric(),
  check('brcofcFeeRate','수수료율은 소수점 2자리까지 입력 가능 합니다.').if(check('brcofcFeeSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('brcofcStateCd','상태 코드는(01: 계약, 02:해지)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var brcofcId = data.brcofcId;
  delete data.brcofcId;
  // 지점 등록 여부 검증
  console.log(brcofcId);
  models.branch.findOne( { where : { brcofcId: brcofcId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 지점 입니다."};
      return res.status(400).json( util.successFalse( error ) );
    }
    models.branch.update( data, { where : { brcofcId: brcofcId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 포인트 조회( 지점 ID, 포인트 구분 코드 )
router.get('/branch-point', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var brcofcId      = reqParam.brcofcId || '';
  var pointSeCd     = reqParam.pointSeCd || '';

  var where = {};
  where.brcofcId = brcofcId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.branch_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 지점 포인트 등록
router.post('/branch-point', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd','포인트 구분 코드는(01: 증가, 02: 감소)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02']),
  check('pointAmnt','포인트 금액은 필수 입력 입니다. 원단위로 입력해 주세요.').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('pointNote','포인트 내용이 입력 되지 않았습니다.').optional().notEmpty().bail()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.branch_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 정보 조회( 공유 ID, 지점 ID )
router.get('/branch-share', util.isLoggedin, [
  check('shareId','공유 지점 ID는 Bxxxx 형식으로 입력해 주세요.(ex : B0001)').optional().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId','대상 지점 ID는 Bxxxx 형식으로 입력해 주세요.(ex : B0001)').optional().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var shareId     = reqParam.shareId || '';
  var brcofcId    = reqParam.brcofcId || '';

  var where = {};
  if( shareId ) where.shareId = shareId;
  if( brcofcId ) where.brcofcId = brcofcId;
  models.branch_share.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유  등록
router.post('/branch-share', util.isLoggedin, [
  check('shareId','공유 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId','대상 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('shareDelayTime','공유 지연 시간은 필수 입력 입니다. hhmmss 형식으로 입력해 주세요.(ex : 235959)').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 6, max: 6 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 공유 지점 정보 입니다."};
      return res.status(400).json( util.successFalse( error) );
    }
    models.branch_share.create( req.body ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 수정
router.put('/branch-share', util.isLoggedin, [
  check('shareId','공유 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId','대상 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('shareDelayTime','공유 지연 시간은 필수 입력 입니다. hhmmss 형식으로 입력해 주세요.(ex : 235959)').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 6, max: 6 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 공유 지점 입니다."};
      return res.status(400).json( util.successFalse( error) );
    }
    delete req.body.shareId;
    delete req.body.brcofcId;

    models.branch_share.update( req.body, { where : data } ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 공유 삭제
router.delete('/branch-share', util.isLoggedin,  [
  check('shareId','공유 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId','대상 지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function ( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var shareId = req.body.shareId;
  var brcofcId = req.body.brcofcId;

  models.branch_share.findAll( { where : { shareId: shareId, brcofcId: brcofcId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 공유 지점 입니다."};
      return res.status(400).json( util.successFalse( error) );
    }
    models.branch_share.destroy( { where : { shareId: shareId, brcofcId: brcofcId } } ).then( result => {
      return res.status(200).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
module.exports = router;
