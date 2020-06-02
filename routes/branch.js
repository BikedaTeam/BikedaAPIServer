var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var { check, validationResult } = require('express-validator');

// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
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

  var query = 'select * from tb_branchs where 1=1 ';
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
  check('brcofcBsnsRgnmb').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('brcofcPassword').exists().bail().notEmpty(),
  check('brcofcNm').exists().bail().notEmpty(),
  check('brcofcMtlty').exists().bail().notEmpty(),
  check('brcofcBizSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcRprsntvNm').exists().bail().notEmpty(),
  check('brcofcBrdYmd').if(check('brcofcBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcCrprtRgnmb').if(check('brcofcBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('brcofcOpnngYmd').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcBsnsPlaceAdres').exists().bail().notEmpty(),
  check('brcofcBizcnd').exists().bail().notEmpty(),
  check('brcofcInduty').exists().bail().notEmpty(),
  check('brcofcCelno').exists().bail().notEmpty().isNumeric(),
  check('brcofcFeeSeCd').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('brcofcFeeAmnt').if(check('brcofcFeeSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric(),
  check('brcofcFeeRate').if(check('brcofcFeeSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('brcofcStateCd').exists().bail().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));
  var data = req.body;
  // 지점 등록 여부 검증
  models.branch.findOne( { where : { brcofcBsnsRgnmb: data.brcofcBsnsRgnmb } } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 사업자 번호 입니다."};
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
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcBsnsRgnmb').optional().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('brcofcPassword').optional().notEmpty(),
  check('brcofcNm').optional().notEmpty(),
  check('brcofcMtlty').optional().notEmpty(),
  check('brcofcBizSeCd').optional().notEmpty().bail().isIn(['01','02']),
  check('brcofcRprsntvNm').optional().notEmpty(),
  check('brcofcBrdYmd').if(check('brcofcBizSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcCrprtRgnmb').if(check('brcofcBizSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('brcofcOpnngYmd').optional().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('brcofcBsnsPlaceAdres').optional().notEmpty(),
  check('brcofcBizcnd').optional().notEmpty(),
  check('brcofcInduty').optional().notEmpty(),
  check('brcofcCelno').optional().notEmpty().isNumeric(),
  check('brcofcFeeSeCd').optional().notEmpty().bail().isIn(['01','02']),
  check('brcofcFeeAmnt').if(check('brcofcFeeSeCd').isIn(['01'])).optional().notEmpty().bail().isNumeric(),
  check('brcofcFeeRate').if(check('brcofcFeeSeCd').isIn(['02'])).optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,2})([.]\d{0,2}?)?$/),
  check('brcofcStateCd').optional().notEmpty().bail().isIn(['01','02'])
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
      var error = { message : "존재하지 않는 지점 ID. brcofcId : ' + brcofcId"};
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
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('pointSeCd').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var brcofcId      = reqParam.brcofcId || '';
  var pointSeCd     = reqParam.pointSeCd || '';

  var where = {}
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
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
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

// 바이크다 지점 공유 정보 조회( 공유 ID, 지점 ID )
router.get('/branch-share', util.isLoggedin, [
  check('shareId').optional().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId').optional().notEmpty().bail().isLength({ min: 5, max: 5 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var reqParam = req.query || '';
  var shareId     = reqParam.shareId || '';
  var brcofcId    = reqParam.brcofcId || '';

  var where = {}
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
  check('shareId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('shareDelayTime').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }).bail().isNumeric(),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( result ) {
      var error = { message : "이미 등록된 지점 공유 정보"};
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
  check('shareId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('shareDelayTime').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }).bail().isNumeric(),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var data = req.body;
  delete data.shareDelayTime;

  models.branch_share.findAll( { where : data } ).then( result => {
    if( !result ) {
      var error = { message : "지점 공유 정보가 등록 되어있지 않습니다."};
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
  check('shareId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('brcofcId').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 })
], function ( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.json(util.successFalse(errors));

  var shareId = req.body.shareId;
  var brcofcId = req.body.brcofcId;

  models.branch_share.findAll( { where : { shareId: shareId, brcofcId: brcofcId } } ).then( result => {
    if( !result ) {
      var error = { message : "지점 공유 정보가 등록 되어있지 않습니다."};
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
