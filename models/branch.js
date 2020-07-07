module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_branch', {
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "지점 ID"
    },
    brcofcBsnsRgnmb : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "지점 사업자 등록 번호"
    },
    brcofcNm : {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "지점 명"
    },
    brcofcMtlty : {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "지점 상호"
    },
    brcofcBizSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "지점 사업자 구분 코드"
    },
    brcofcRprsntvNm : {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment : "지점 대표자 명"
    },
    brcofcBrdYmd : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "지점 생년월일"
    },
    brcofcCrprtRgnmb : {
      type: DataTypes.STRING(13),
      allowNull: true,
      comment : "지점 법인 등록 번호"
    },
    brcofcOpnngYmd : {
      type: DataTypes.STRING(8),
      allowNull: false,
      comment : "지점 개업 년월일"
    },
    brcofcBsnsPlaceAdres : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "지점 사업장 주소"
    },
    brcofcHdofcAdres : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "지점 본점 주소"
    },
    brcofcBizcnd : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "지점 업태"
    },
    brcofcInduty : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "지점 업종"
    },
    brcofcTelno : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "지점 연락처"
    },
    brcofcVrtlAcnt : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "지점 가상 계좌"
    },
    brcofcFeeSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "지점 수수료 구분 코드"
    },
    brcofcFeeAmnt : {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment : "지점 수수료 금액"
    },
    brcofcFeeRate : {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
      defaultValue: 0,
      comment : "지점 수수료 율"
    },
    brcofcStateCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "지점 상태 코드"
    }
  },
  {
      timestamps: true,
  });
};
