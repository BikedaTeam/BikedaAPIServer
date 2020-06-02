var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

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
router.post('/store', util.isLoggedin, [
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoBsnsRgnmb').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('stoPassword').exists().bail().notEmpty(),
  check('stoMtlty').exists().bail().notEmpty(),
  check('stoBizSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('stoRprsntvNm').exists().bail().notEmpty(),
  check('stoBrdYmd').if(check('stoBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoCrprtRgnmb').if(check('stoBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('stoOpnngYmd').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoBsnsPlaceAdres').exists().bail().notEmpty(),
  check('stoBizcnd').exists().bail().notEmpty(),
  check('stoInduty').exists().bail().notEmpty(),
  check('stoCelno').exists().bail().notEmpty().isNumeric(),
  check('stoSetSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('stoNightSrchrApplyYn').exists().bail().notEmpty().bail().isIn(['Y','N']),
  check('stoNightSrchrStdTm').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrEndTm').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrAmnt').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('stoLa').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoStateCd').exists().bail().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoBsnsRgnmb: data.stoBsnsRgnmb } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 사업자 번호 입니다."};      errors.errors= error;
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId').optional().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoBsnsRgnmb').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('stoPassword').optional().notEmpty(),
  check('stoMtlty').optional().notEmpty(),
  check('stoBizSeCd').optional().notEmpty().bail().isIn(['01','02']),
  check('stoRprsntvNm').optional().notEmpty(),
  check('stoBrdYmd').if(check('stoBizSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoCrprtRgnmb').if(check('stoBizSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('stoOpnngYmd').optional().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoBsnsPlaceAdres').optional().notEmpty(),
  check('stoBizcnd').optional().notEmpty(),
  check('stoInduty').optional().notEmpty(),
  check('stoCelno').optional().notEmpty().isNumeric(),
  check('stoSetSeCd').optional().notEmpty().bail().isIn(['01','02']),
  check('stoNightSrchrApplyYn').optional().notEmpty().bail().isIn(['Y','N']),
  check('stoNightSrchrStdTm').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrEndTm').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrAmnt').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('stoLa').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoStateCd').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var stoId = data.stoId;
  delete data.stoId;
  // 상점 등록 여부 검증
  models.store.findOne( { where : { stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "존재하지 않는 상점 ID. brcofcId : ' + brcofcId"};
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId      = reqParam.stoId || '';
  var pointSeCd  = reqParam.pointSeCd || '';

  var where = {}
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('pointAmnt').exists().bail().notEmpty().bail().isNumeric(),
  check('pointNote').optional().notEmpty().bail()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.branch_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 조회( 상점 ID, 할증 구분 코드 )
router.get('/store-surcharge', util.isLoggedin, [
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd').optional().notEmpty().bail().isIn(['01','02','03','04'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId      = reqParam.stoId || '';
  var srchrSeCd  = reqParam.srchrSeCd || '';

  var where = {}
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd').exists().bail().notEmpty().bail().isIn(['01','02','03','04']),
  check('srchrAmnt').exists().bail().notEmpty().bail().isNumeric(),
  check('srchrApplyYn').exists().bail().notEmpty().bail().isIn(['Y','N'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.store_surcharge.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 할증 수정
router.put('/store-surcharge', util.isLoggedin, [
  check('srchrSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('srchrSeCd').optional().notEmpty().bail().isIn(['01','02','03','04']),
  check('srchrAmnt').optional().notEmpty().bail().isNumeric(),
  check('srchrApplyYn').optional().notEmpty().bail().isIn(['Y','N'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var srchrSeqNo = data.srchrSeqNo;
  var stoId = data.stoId;

  delete data.srchrSeqNo;
  delete data.stoId;

  // 상점 할증 등록 여부 검증
  models.store_surcharge.findOne( { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 할증 정보"};
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
  check('srchrSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var srchrSeqNo = req.body.srchrSeqNo;
  var stoId = req.body.stoId;

  // 상점 할증 등록 여부 검증
  models.store_surcharge.findAll( { where : { srchrSeqNo : srchrSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 할증 정보"};
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {}
  where.stoId = stoId;
  models.store_distance_setting.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 등록
router.post('/store-distance', util.isLoggedin, [
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setStdDstnc').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setEndDstnc').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setAmnt').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.store_distance_setting.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 거리 설정 수정
router.put('/store-distance', util.isLoggedin, [
  check('setSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setStdDstnc').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setEndDstnc').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('setAmnt').optional().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_distance_setting.findOne( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 거리 설정 정보"};
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
  check('setSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_distance_setting.findAll( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 거리 설정 정보"};
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
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var stoId     = reqParam.stoId || '';

  var where = {}
  where.stoId = stoId;
  models.store_area_setting.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 지역 설정 등록
router.post('/store-area', util.isLoggedin, [
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setHCd').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('setDCd').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('setPrvnc').exists().bail().notEmpty(),
  check('setMncpl').exists().bail().notEmpty(),
  check('setSbmnc').exists().bail().notEmpty(),
  check('setVlg').optional().notEmpty(),
  check('setAmnt').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  models.store_area_setting.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 상점 지역 설정 수정
router.put('/store-area', util.isLoggedin, [
  check('setSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setHCd').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('setDCd').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('setPrvnc').optional().notEmpty(),
  check('setMncpl').optional().notEmpty(),
  check('setSbmnc').optional().notEmpty(),
  check('setVlg').optional().notEmpty(),
  check('setAmnt').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 지역 설정 등록 여부 검증
  models.store_area_setting.findOne( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 지역 설정 정보"};
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
  check('setSeqNo').exists().bail().notEmpty().bail().isNumeric().bail(),
  check('stoId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  var setSeqNo = data.setSeqNo;
  var stoId = data.stoId;

  delete data.setSeqNo;
  delete data.stoId;

  // 상점 거리 설정 등록 여부 검증
  models.store_area_setting.findAll( { where : { setSeqNo : setSeqNo, stoId: stoId } } ).then( result => {
    if( !result ) {
      var error = { message : "등록 되지 않은 지역 설정 정보"};
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
module.exports = router;
