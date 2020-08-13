var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var mysqlConnect = require('../mysqlConnect');
var { check, validationResult } = require('express-validator');

// 지점 로그인 인증 및 토큰 생성
router.post('/login', [
  check('adminId', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty(),
  check('adminPassword', '관리자 ID / 비밀번호는 필수 입력 입니다').exists().bail().notEmpty()
], function( req, res, next ){
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'login', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    if( results.length == 1 ) {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);

      var payload = {
        adminId : json[0].adminId,
        brcofcId : json[0].brcofcId
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        json[0].token = token;
        res.status(200).json(util.successTrue(json[0]));
      });
    } else {
      res.status(401).json(util.successFalse("관리자 ID 또는 비밀번호가 일치 하지 않습니다."));
    }
  });
});
//테스트
router.get('/test', function ( req, res, next) {
  var data = {}
  data.test = 'test';
  res.status(200).json(util.successTrue(data));
});
// 배달 조회(  )
// router.get('/realTimeDelivery', util.isLoggedin, function( req, res, next ) {
router.get('/realTimeDelivery', function( req, res, next ) {
  mysqlConnect('branch', 'realTimeDelivery', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 배달 건수 조회(  )
router.get('/realTimeDeliveryCount', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeDeliveryCount', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 배달 배차 가능 라이더 조회
router.get('/realTimeDispatchRider', util.isLoggedin, function( req, res, next) {
  mysqlConnect('branch', 'realTimeDispatchRider', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 배달 배차
router.post('/realTimeDispatch', util.isLoggedin, function( req, res, next) {
  mysqlConnect('branch', 'validateDelivery', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].dlvryCnt == 1 ) {
      mysqlConnect('branch', 'realTimeDispatch', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          res.status(200).json(util.successTrue(json));
        }
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 주문 번호 입니다."));
    }
  });
});

// 배달 취소
router.post('/realTimeCancelDelivery', util.isLoggedin, [
  check('dlvryNo','주문 번호는 필수 입력 입니다. 상점ID(5) + "O" + 날짜(8) + 일련번호 형식으로 입력해 주세요.(ex : S0001O1900123100001)').exists().bail().notEmpty().bail().isLength({ min: 19, max: 19 })
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateDelivery', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].dlvryCnt == 1 ) {
      mysqlConnect('branch', 'realTimeCancelDelivery', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          res.status(200).json(util.successTrue(json));
        }
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 주문 번호 입니다."));
    }
  });
});

// 실시간 라이더 조회
router.get('/realTimeRider', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeRider', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});
// 실시간 라이더 배달 내용 조회
router.get('/realTimeRiderDelivery', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'realTimeRiderDelivery', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 조회
router.get('/stores', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'stores', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 할증
router.get('/storeSurcharge', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSurcharge', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 지역 설정
router.get('/storeAreaSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeAreaSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 지역 설정 좌표
router.get('/storeAreaSettingCoordinate', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeAreaSettingCoordinate', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});


// 상점 거리 설정
router.get('/storeDistanceSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeDistanceSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 특별 설정
router.get('/storeSpecialSetting', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSpecialSetting', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 상점 특별 설정
router.get('/storeSpecialSettingLocation', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'storeSpecialSettingLocation', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});
// 상점 등록
router.post('/storeRegister', util.isLoggedin, [
  check('brcofcId','지점 ID는 필수 입력 입니다. Bxxxx 형식으로 입력해 주세요.(ex : B0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoBsnsRgnmb','사업자 번호는 (-)를 제외한 10자리 숫자를 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric().bail().isLength({ min: 10, max: 10 }),
  check('stoMtlty','상호가 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('stoBizSeCd','사업자 구분 코드는 (01: 개인 사업자, 02: 법인 사업자)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02']),
  check('stoRprsntvNm','대표자명이 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('stoBrdYmd','대표자 생년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231)').if(check('stoBizSeCd').isIn(['01'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoCrprtRgnmb','법인 등록 번호는 (-)를 제외한 13자리 숫자를 입력해 주세요.').if(check('stoBizSeCd').isIn(['02'])).exists().bail().notEmpty().bail().isNumeric().bail().isLength({min:13, max:13}),
  check('stoOpnngYmd','개업 년월일은 YYYYMMDD 형식으로 입력해 주세요.(ex : 19001231).').exists().bail().notEmpty().isNumeric().bail().isLength({min:8, max:8}).bail().matches(/^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/),
  check('stoBsnsPlaceAdres','사업장 주소가 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('stoBizcnd','업태가 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('stoInduty','업종이 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('stoTelno','연락처는 (-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('stoLa','위도는 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo','경도는 소수점 20자리 까지 입력 가능 합니다.').exists().bail().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/)
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 0 ) {
      mysqlConnect('branch', 'storeId', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          if( json[0].stoId ) {
            req.body.stoId = json[0].stoId;
            mysqlConnect('branch', 'storeRegister', req.body, function (error, results) {
              if (error) {
                res.status(500).json(util.successFalse("SQL Error"));
              } else {
                var string = JSON.stringify(results);
                var json =  JSON.parse(string);
                res.status(200).json(util.successTrue(json));
              }
            });
          }
        }
      });
    } else {
      res.status(401).json(util.successFalse("이미 등록된 사업자 번호 입니다."));
    }
  });
});

// 상점 수정
router.post('/storeModify', util.isLoggedin, [
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
  check('stoLa','위도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoLo','경도는 소수점 20자리 까지 입력 가능 합니다.').optional().notEmpty().bail().isNumeric().bail().matches(/^(\d{1,3})([.]\d{0,20}?)?$/),
  check('stoStateCd','상태 코드는(01: 계약, 02:해지)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      mysqlConnect('branch', 'storeModify', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          res.status(200).json(util.successTrue(json));
        }
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 상점 입니다."));
    }
  });
});

// 상점 야간 할증 수정
router.post('/storeModifyNightSurcharge', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoNightSrchrApplyYn','야간 할증 적용 여부는 (Y , N)으로 입력해 주세요.').optional().notEmpty().bail().isIn(['Y','N']),
  check('stoNightSrchrStdTm','야간 할증 시작 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrEndTm','야간 할증 종료 시간은 hhmmss 형식으로 입력해 주세요.(ex : 235959).').optional().notEmpty().bail().isNumeric().isLength({ min: 6, max: 6 }),
  check('stoNightSrchrAmnt','야간 할증 수수료 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      mysqlConnect('branch', 'storeModifyNightSurcharge', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var surchargeArray = req.body.surcharge;
          for( var i = 0; i < surchargeArray.length; i++){
            var surcharge = surchargeArray[i];
            mysqlConnect('branch', 'storeModifySurcharge', surcharge, function (error, results) {
              if (error) {
                res.status(500).json(util.successFalse("SQL Error"));
              }
            });
          }

          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          res.status(200).json(util.successTrue(json));
        }
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 상점 입니다."));
    }
  });
});

// 상점 요금 수정
router.post('/storeModifyFee', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('stoSetSeCd','설정 구분 코드는 (01: 지역, 02: 거리)로 입력해 주세요.').exists().bail().notEmpty().bail().isIn(['01','02'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      mysqlConnect('branch', 'storeModifyFee', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        }
      });

      if( req.body.stoSetSeCd == '01'){
        var stoSetData = req.body.stoSetData;
        for( var i = 0; i < stoSetData.length; i++){
          var areaData = stoSetData[i];
          if( areaData.setSeqNo == '0' ) {
            mysqlConnect('branch', 'storeModifyFeeAreaInst', areaData, function (error, results) {
              if (error) {
                console.log(error);
                res.status(500).json(util.successFalse("SQL Error"));
              }
            });
          } else {
            mysqlConnect('branch', 'storeModifyFeeAreaUpdt', areaData, function (error, results) {
              if (error) {
                console.log(error);
                res.status(500).json(util.successFalse("SQL Error"));
              }
            });
          }
        }
      } else if( req.body.stoSetSeCd == '02'){
        var stoSetData = req.body.stoSetData;
        for( var i = 0; i < stoSetData.length; i++){
          var distanceData = stoSetData[i];
          if( distanceData.setSeqNo == '0' ) {
            mysqlConnect('branch', 'storeModifyFeeDdistanceInst', distanceData, function (error, results) {
              if (error) {
                res.status(500).json(util.successFalse("SQL Error"));
              }
            });
          } else {
            mysqlConnect('branch', 'storeModifyFeeDistanceUpdt', distanceData, function (error, results) {
              if (error) {
                res.status(500).json(util.successFalse("SQL Error"));
              }
            });
          }
        }
      }
      res.status(200).json(util.successTrue(null));
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 상점 입니다."));
    }
  });
});

// 상점 지역 설정 삭제
router.post('/storeModifyFeeAreaDelt', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setSeqNo','설정 일련 번호는 필수 입력 입니다').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  console.log(req.body);
  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      mysqlConnect('branch', 'storeModifyFeeAreaDelt', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        }
      });
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 지역 설정 삭제
router.post('/storeModifyFeeDistanceDelt', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
  check('setSeqNo','설정 일련 번호는 필수 입력 입니다').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      mysqlConnect('branch', 'storeModifyFeeDistanceDelt', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        }
      });
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 상점 특수 요금 수정
router.post('/storeModifySpecial', util.isLoggedin, [
  check('stoId','상점 ID는 필수 입력 입니다. Sxxxx 형식으로 입력해 주세요.(ex : S0001)').exists().bail().notEmpty().bail().isLength({ min: 5, max: 5 }),
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));

  mysqlConnect('branch', 'validateStore', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].stoId == 1 ) {
      var stoSetDatas = req.body.stoSetData;
      for( var i = 0; i < stoSetDatas.length; i++){
        var stoSetData = stoSetDatas[i];
        if( stoSetData.setSeqNo == '0' ){
          mysqlConnect('branch', 'storeModifyFeeSpecialInst', stoSetData, function (error, results) {
            if (error) {
              res.status(500).json(util.successFalse("SQL Error"));
            }

            if( stoSetData.points ) {
              for( var j = 0 ; j < stoSetData.points.length ; j++ ) {
                var location = {};
                location.stoId = stoSetData.stoId;
                location.setSeqNo = results.insertId;
                location.lctnLa = stoSetData.points[j].y;
                location.lctnLo = stoSetData.points[j].x;
                console.log(location);
                mysqlConnect('branch', 'storeModifyFeeSpecialLocationInst', location, function (error, results) {
                  if (error) {
                    res.status(500).json(util.successFalse("SQL Error"));
                  }
                });
              }
            }
          });
        } else {
          mysqlConnect('branch', 'storeModifyFeeSpecialUpdt', stoSetData, function (error, results) {
            if (error) {
              res.status(500).json(util.successFalse("SQL Error"));
            }
            if( stoSetData.points ) {
              mysqlConnect('branch', 'storeModifyFeeSpecialLocationDelt', stoSetData, function (error, results) {
                if (error) {
                  res.status(500).json(util.successFalse("SQL Error"));
                }
              });
              for( var j = 0 ; j < stoSetData.points.length ; j++ ) {
                var location = {};
                location.stoId = stoSetData.stoId;
                location.setSeqNo = stoSetData.setSeqNo;
                location.lctnLa = stoSetData.points[j].y;
                location.lctnLo = stoSetData.points[j].x;
                console.log(location);
                mysqlConnect('branch', 'storeModifyFeeSpecialLocationInst', location, function (error, results) {
                  if (error) {
                    res.status(500).json(util.successFalse("SQL Error"));
                  }
                });
              }
            }
          });
        }
      }
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    res.status(200).json(util.successTrue(json));
  });
});

// 라이더 조회
router.get('/riders', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'riders', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});
// 바이크다 기사 등록
router.post('/riderRegister', util.isLoggedin, [
  check('riderCelno','(-)를 제외한 숫자로 입력해 주세요.').exists().bail().notEmpty().isNumeric(),
  check('riderNm','성명 입력 되지 않았습니다.').exists().bail().notEmpty(),
  check('riderMinWthdrAmnt','최소 출금 금액은 원단위로 입력해 주세요.').exists().bail().exists().bail().notEmpty().bail().isNumeric(),
  check('riderCallLimit','콜 제한 수가 입력 되지 않았습니다.').exists().bail().notEmpty().bail().isNumeric(),
  check('riderCallDelayTime','콜 지연 시간은 초단위로 입력해 주세요.').exists().bail().notEmpty().bail().isNumeric()
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateRider', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].riderId == 0 ) {
      mysqlConnect('branch', 'riderId', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          if( json[0].riderId ) {
            req.body.riderId = json[0].riderId;
            mysqlConnect('branch', 'riderRegister', req.body, function (error, results) {
              if (error) {
                res.status(500).json(util.successFalse("SQL Error"));
              } else {
                var string = JSON.stringify(results);
                var json =  JSON.parse(string);
                res.status(200).json(util.successTrue(json));
              }
            });
          }
        }
      });
    } else {
      res.status(401).json(util.successFalse("이미 등록된 기사 입니다."));
    }
  });
});
// 바이크다 기사 수정
router.post('/riderModify', util.isLoggedin, [
  check('riderId','기사 ID는 필수 입력 입니다. Rxxxxx 형식으로 입력해 주세요.(ex : R00001)').exists().bail().notEmpty().bail().isLength({ min: 6, max: 6 }),
  check('riderCelno','(-)를 제외한 숫자로 입력해 주세요.').optional().notEmpty().isNumeric(),
  check('riderNm','성명 입력 되지 않았습니다.').optional().notEmpty(),
  check('riderMinWthdrAmnt','최소 출금 금액은 원단위로 입력해 주세요.').optional().exists().bail().notEmpty().bail().isNumeric(),
  check('riderCallLimit','콜 제한 수가 입력 되지 않았습니다.').optional().notEmpty().bail().isNumeric(),
  check('riderCallDelayTime','콜 지연 시간은 초단위로 입력해 주세요.').optional().notEmpty().bail().isNumeric(),
  check('riderStateCd','상태 코드는(01: 정상, 02:해지, 03:휴무)로 입력해 주세요.').optional().notEmpty().bail().isIn(['01','02','03'])
], function( req, res, next ) {
  var errors = validationResult(req);
  if( !errors.isEmpty() ) return res.status(400).json(util.successFalse(errors));
  mysqlConnect('branch', 'validateRider', req.body, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    }
    var string = JSON.stringify(results);
    var json =  JSON.parse(string);
    if( json[0].riderId == 1 ) {
      mysqlConnect('branch', 'riderModify', req.body, function (error, results) {
        if (error) {
          res.status(500).json(util.successFalse("SQL Error"));
        } else {
          var string = JSON.stringify(results);
          var json =  JSON.parse(string);
          res.status(200).json(util.successTrue(json));
        }
      });
    } else {
      res.status(401).json(util.successFalse("등록 되지 않은 기사 입니다."));
    }
  });
});
// 지점 포인트 총액 조회
router.get('/branchTotPoint', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'branchTotPoint', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 지점 포인트 조회
router.get('/branchPoint', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'branchPoint', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 기사 포인트 총액 조회
router.get('/riderTotPoint', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'riderTotPoint', req.query, function (error, results) {
    if (error) {
      res.status(500).json(util.successFalse("SQL Error"));
    } else {
      var string = JSON.stringify(results);
      var json =  JSON.parse(string);
      res.status(200).json(util.successTrue(json));
    }
  });
});

// 기사 포인트 조회
router.get('/riderPoint', util.isLoggedin, function( req, res, next ) {
  mysqlConnect('branch', 'riderPoint', req.query, function (error, results) {
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
