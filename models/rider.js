module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_rider', {
    riderId : {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey : true,
      comment : "라이더 ID"
    },
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment : "지점 ID"
    },
    riderCelno : {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment : "라이더 핸드폰"
    },
    riderNm : {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "라이더 명"
    },
    riderWthdrBankCd : {
      type: DataTypes.STRING(3),
      allowNull: true,
      comment : "라이더 출금 은행 코드"
    },
    riderWthdrAcnt : {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment : "라이더 출금 계좌"
    },
    riderLoginYn : {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'N',
      comment : "라이더 로그인 여부"
    },
    riderMinWthdrAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "라이더 최소 출금 금액"
    },
    riderCallLimit :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "라이더 콜 제한 수"
    },
    riderCallDelayTime :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "라이더 콜 지연 시간"
    }
  },
  {
      timestamps: true,
  });
};
