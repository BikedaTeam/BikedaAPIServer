var Schema = require('validate');
var schema = {};
var create = new Schema({
  'stoBsnsRgnmb' : { type : String, required : true, length : 10,
    message : {
      required : "사업자 등록 번호는 필수 입니다.",
      length : "사업자 등록 번호는 10자리 입니다."
    } },
  'stoPassword' : { type : String, required : true,
    message : {
      required : "비밀번호는 필수 입니다."
    } },
  'stoMtlty' : { type : String, required : true,
    message : {
      required : "상호는 필수 입력입니다.(사업자 등록증상 상호)"
    } },
  'stoBizSeCd' : { type : String, required : true, enum:['01','02'],
    message : {
      required : "사업자 구분 코드는 필수 입력입니다.",
      enum : "사업자 구분을 선택하여 주십시오."
    } },
  'stoRprsntvNm' : { type : String, required : true,
    message : {
      required : "일반은 성명, 법인은 대표자명은 필수 입력입니다."
    } },
  'stoBrdYmd' : { type : String, required : false, length : 8,
    message : {
      length : "생년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'stoCrprtRgnmb' : { type : String, required : false, length : 13,
    message : {
      length : "법인 등록번호는 13자리 입니다."
    } },
  'stoOpnngYmd' : { type : String, required : true, length : 8,
    message : {
      required : "개업 년월일은 필수 입력입니다.",
      length : "개업 년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'stoBsnsPlaceAdres' : { type : String, required : true,
    message : {
      required : "사업장 주소는 필수 입력 입니다."
    } },
  'stoHdofcAdres' : { type : String, required : false
  },
  'stoBizcnd' : { type : String, required : true,
    message : {
      required : "업태는 필수 입력 입니다."
    } },
  'stoInduty' : { type : String, required : true,
    message : {
      required : "업종는 필수 입력 입니다."
    } },
  'stoTelno' : { type : String, required : true,
    message : {
      required : "연락처는 필수 입력 입니다."
    } },
  'stoCelno' : { type : String, required : false
  },
  'stoVrtlAcnt' : { type : String, required : false
  },
  'stoSetSeCd' : { type : String, required : true, enum:['01','02'],
    message : {
      required : "설정 구분 코드는 필수 입력입니다.",
      enum : "설정 구분을 선택하여 주십시오."
    } },
  'stoNightSrchrApplyYn' : { type : String, required : true, enum:['Y','N'],
    message : {
      required : "야간 할증 여부는 필수 입력입니다.",
      enum : "야간 할증 여부를 선택하여 주십시오."
    } },
  'stoNightSrchrStdTm' : { match : /^[0-2][0-3][0-5][0-9][0-5][0-9]$/, required : false,
    message : {
      match : "야간 할증 시작 시간은 (000000 ~ 235959)로 입력 하여 주십시오.
    } },
  'stoNightSrchrEndTm' : { match : /^[0-2][0-3][0-5][0-9][0-5][0-9]$/, required : false,
    message : {
      match : "야간 할증 종료 시간은 (000000 ~ 235959)로 입력 하여 주십시오.
    } },
  'stoNightSrchrAmnt' : { match : /^[0-9]$/, required : false,
    message : {
      match : "야간 할증 금액(원 단위)으로 입력하여 주십시오."
    } },
  'stoLa' : { match : /^(\d{1,3})([.]\d{0,20}?)?$/, required : true,
    message : {
      required : "위도는 필수 입력입니다.",
      match : "위도는 정수3자리 소수점20자리 이하로 입력 하여주십시오."
    } },
  'stoLo' : { match : /^(\d{1,3})([.]\d{0,20}?)?$/, required : true,
    message : {
      required : "경도는 필수 입력입니다.",
      match : "경도는 정수3자리 소수점20자리 이하로 입력 하여주십시오."
    } },
});

var update = new Schema({
  'stoId' : { type : String, required : true, length : 5,
    message : {
      required : "지점 ID는 필수 입니다.",
      length : "지점 ID는 5자리 입니다."
    } },
  'stoBsnsRgnmb' : { type : String, required : false, length : 10,
    message : {
      length : "사업자 등록 번호는 10자리 입니다."
    } },
  'stoPassword' : { type : String, required : false,
  },
  'stoMtlty' : { type : String, required : false,
  },
  'stoBizSeCd' : { type : String, required : false, enum:['01','02'],
    message : {
      enum : "사업자 구분을 선택하여 주십시오."
    } },
  'stoRprsntvNm' : { type : String, required : false,
  },
  'stoBrdYmd' : { type : String, required : false, length : 8,
    message : {
      length : "생년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'stoCrprtRgnmb' : { type : String, required : false, length : 13,
    message : {
      length : "법인 등록번호는 13자리 입니다."
    } },
  'stoOpnngYmd' : { type : String, required : false, length : 8,
    message : {
      length : "개업 년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'stoBsnsPlaceAdres' : { type : String, required : false,
  },
  'stoHdofcAdres' : { type : String, required : false
  },
  'stoBizcnd' : { type : String, required : false,
  },
  'stoInduty' : { type : String, required : false,
  },
  'stoTelno' : { type : String, required : false,
  },
  'stoCelno' : { type : String, required : false
  },
  'stoVrtlAcnt' : { type : String, required : false
  },
  'stoSetSeCd' : { type : String, required : false, enum:['01','02'],
    message : {
      enum : "설정 구분을 선택하여 주십시오."
    } },
  'stoNightSrchrApplyYn' : { type : String, required : false, enum:['Y','N'],
    message : {
      enum : "야간 할증 여부를 선택하여 주십시오."
    } },
  'stoNightSrchrStdTm' : { match : /^[0-2][0-3][0-5][0-9][0-5][0-9]$/, required : false,
    message : {
      match : "야간 할증 시작 시간은 (000000 ~ 235959)로 입력 하여 주십시오.
    } },
  'stoNightSrchrEndTm' : { match : /^[0-2][0-3][0-5][0-9][0-5][0-9]$/, required : false,
    message : {
      match : "야간 할증 종료 시간은 (000000 ~ 235959)로 입력 하여 주십시오.
    } },
  'stoNightSrchrAmnt' : { match : /^[0-9]$/, required : false,
    message : {
      match : "야간 할증 금액(원 단위)으로 입력하여 주십시오."
    } },
  'stoLa' : { match : /^(\d{1,3})([.]\d{0,20}?)?$/, required : false,
    message : {
      match : "위도는 정수3자리 소수점20자리 이하로 입력 하여주십시오."
    } },
  'stoLo' : { match : /^(\d{1,3})([.]\d{0,20}?)?$/, required : false,
    message : {
      match : "경도는 정수3자리 소수점20자리 이하로 입력 하여주십시오."
    } },
});
schema.create = create;
schema.update = update;
module.exports = schema;
