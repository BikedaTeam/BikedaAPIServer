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
    setPrvncSeCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 시도 구분 코드"
    },
    setMncplSeCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 시군구 구분 코드"
    },
    setSbmncSeCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "설정 읍면동 구분 코드"
    },
    setVlgSeCd :{
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
      comment : "설정 리 구분 코드"
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
