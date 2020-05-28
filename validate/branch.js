var Schema = require('validate');
var schema = {};
var create = new Schema({
  'brcofcBsnsRgnmb' : { type : String, required : true, length : 10,
    message : {
      required : "사업자 등록 번호는 필수 입니다.",
      length : "사업자 등록 번호는 10자리 입니다."
    } },
  'brcofcPassword' : { type : String, required : true,
    message : {
      required : "비밀번호는 필수 입니다."
    } },
  'brcofcNm' : { type : String, required : true,
    message : {
      required : "지점명은 필수 입니다.."
    } },
  'brcofcMtlty' : { type : String, required : true,
    message : {
      required : "상호는 필수 입력입니다.(사업자 등록증상 상호)"
    } },
  'brcofcBizSeCd' : { type : String, required : true, enum:['01','02'],
    message : {
      required : "사업자 구분 코드는 필수 입력입니다.",
      enum : "사업자 구분을 선택하여 주십시오."
    } },
  'brcofcRprsntvNm' : { type : String, required : true,
    message : {
      required : "일반은 성명, 법인은 대표자명은 필수 입력입니다."
    } },
  'brcofcBrdYmd' : { type : String, required : false, length : 8,
    message : {
      length : "생년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'brcofcCrprtRgnmb' : { type : String, required : false, length : 13,
    message : {
      length : "법인 등록번호는 13자리 입니다."
    } },
  'brcofcOpnngYmd' : { type : String, required : true, length : 8,
    message : {
      required : "개업 년월일은 필수 입력입니다.",
      length : "개업 년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'brcofcBsnsPlaceAdres' : { type : String, required : true,
    message : {
      required : "사업장 주소는 필수 입력 입니다."
    } },
  'brcofcHdofcAdres' : { type : String, required : false
  },
  'brcofcBizcnd' : { type : String, required : true,
    message : {
      required : "업태는 필수 입력 입니다."
    } },
  'brcofcInduty' : { type : String, required : true,
    message : {
      required : "업종는 필수 입력 입니다."
    } },
  'brcofcTelno' : { type : String, required : true,
    message : {
      required : "연락처는 필수 입력 입니다."
    } },
  'brcofcCelno' : { type : String, required : false
  },
  'brcofcVrtlAcnt' : { type : String, required : false
  },
  'brcofcFeeSeCd' : { type : String, required : true, enum:['01','02'],
    message : {
      required : "수수료 구분 코드는 필수 입력입니다.",
      enum : "수수료 구분을 선택하여 주십시오."
    } },
  'brcofcFeeAmnt' : { match : /^[0-9]$/, required : false,
    message : {
      match : "수수료 금액(원 단위)으로 입력하여 주십시오."
    } },
  'brcofcFeeRate' : { match : /^(\d{1,2})([.]\d{0,2}?)?$/, required : false,
    message : {
      match : "수수료 율을 100보다 작은 소수점 2자리까지 입력하여 주십시오."
    } },
  'brcofcStateCd' : { type : String, required : true, enum:['01','02'],
    message : {
      required : "상태 구분 코드는 필수 입력입니다.",
      enum : "상태 구분을 선택하여 주십시오."
    } },
});

var update = new Schema({
  'brcofcId' : { type : String, required : true, length : 5 ,
    message : {
      required : "지점 ID는 필수 입니다.",
      length : "지점 ID는 5자리 입니다."
    } },
  'brcofcBsnsRgnmb' : { type : String, required : false, length : 10,
    message : {
      length : "사업자 등록 번호는 10자리 입니다."
    } },
  'brcofcPassword' : { type : String, required : false,
  },
  'brcofcNm' : { type : String, required : false,
  },
  'brcofcMtlty' : { type : String, required : false,
  },
  'brcofcBizSeCd' : { type : String, required : false, enum : ['01','02'],
    message : {
      enum : "사업자 구분을 선택하여 주십시오."
    } },
  'brcofcRprsntvNm' : { type : String, required : false,
  },
  'brcofcBrdYmd' : { type : String, required : false, length : 8,
    message : {
      length : "생년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'brcofcCrprtRgnmb' : { type : String, required : false, length : 13,
    message : {
      length : "법인 등록번호는 13자리 입니다."
    } },
  'brcofcOpnngYmd' : { type : String, required : false, length : 8,
    message : {
      length : "개업 년월일은 YYYYMMDD 형식으로 입력 하여 주십시오."
    } },
  'brcofcBsnsPlaceAdres' : { type : String, required : false,
  },
  'brcofcHdofcAdres' : { type : String, required : false
  },
  'brcofcBizcnd' : { type : String, required : false,
  },
  'brcofcInduty' : { type : String, required : false,
  },
  'brcofcTelno' : { type : String, required : false,
  },
  'brcofcCelno' : { type : String, required : false
  },
  'brcofcVrtlAcnt' : { type : String, required : false
  },
  'brcofcFeeSeCd' : { type : String, required : false, enum:['01','02'],
    message : {
      enum : "수수료 구분을 선택하여 주십시오."
    } },
  'brcofcFeeAmnt' : { match : /^[0-9]$/, required : false,
    message : {
      match : "수수료 금액(원 단위)으로 입력하여 주십시오."
    } },
  'brcofcFeeRate' : { match : /^(\d{1,2})([.]\d{0,2}?)?$/, required : false,
    message : {
      match : "수수료 율을 100보다 작은 소수점 2자리까지 입력하여 주십시오."
    } },
  'brcofcStateCd' : { type : String, required : false, enum:['01','02'],
    message : {
      enum : "상태 구분을 선택하여 주십시오."
    } },
});
schema.create = create;
schema.update = update;
module.exports = schema;
