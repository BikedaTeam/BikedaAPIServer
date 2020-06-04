module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store', {
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "상점 ID"
    },
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment : "지점 ID"
    },
    stoBsnsRgnmb : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "상점 사업자 등록 번호"
    },
    stoPassword :{
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "상점 비밀번호"
    },
    stoMtlty : {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "상점 상호"
    },
    stoBizSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "상점 사업자 구분 코드"
    },
    stoRprsntvNm : {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment : "상점 대표자 명"
    },
    stoBrdYmd : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "상점 생년월일"
    },
    stoCrprtRgnmb : {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment : "상점 법인 등록 번호"
    },
    stoOpnngYmd : {
      type: DataTypes.STRING(8),
      allowNull: false,
      comment : "상점 개업 년월일"
    },
    stoBsnsPlaceAdres : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "상점 사업장 주소"
    },
    stoHdofcAdres : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "상점 본점 주소"
    },
    stoBizcnd : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "상점 업태"
    },
    stoInduty : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "상점 업종"
    },
    stoTelno : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "상점 연락처"
    },
    stoCelno : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "상점 핸드폰"
    },
    stoVrtlAcnt : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "상점 가상 계좌"
    },
    stoSetSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "상점 설정 구분 코드"
    },
    stoNightSrchrApplyYn : {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N',
      comment : "상점 야간 할증 적용 여부"
    },
    stoNightSrchrStdTm : {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: '000000',
      comment : "상점 야간 할증 시작 시간"
    },
    stoNightSrchrEndTm : {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: '000000',
      comment : "상점 야간 할증 종료 시간"
    },
    stoNightSrchrAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "상점 야간 할증 금액"
    },
    stoLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "상점 위도"
    },
    stoLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "상점 경도"
    },
    stoStateCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "상점 상태 코드"
    }
  },
  {
      timestamps: true,
  });
};
