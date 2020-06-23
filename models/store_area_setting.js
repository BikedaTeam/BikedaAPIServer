module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_store_area_setting', {
    setSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "설정 일련번호"
    },
    stoId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "상점 ID"
    },
    setSdCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 시도 코드"
    },
    setSggCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 시군구 코드"
    },
    setEmdCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 읍면동 코드"
    },
    setRiCd :{
      type: DataTypes.STRING(10),
      allowNull: true,
      comment : "설정 리"
    },
    setDCd : {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment : "상점 법정동 코드"
    },
    setAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "설정 금액"
    }
  },
  {
      timestamps: true,
  });
};
