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
    setHCd : {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment : "상점 행정 코드"
    },
    setDCd : {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment : "상점 동별 코드"
    },
    setPrvnc :{
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "설정 시도"
    },
    setMncpl :{
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "설정 시군구"
    },
    setSbmnc :{
      type: DataTypes.STRING(100),
      allowNull: false,
      comment : "설정 읍면동"
    },
    setVlg :{
      type: DataTypes.STRING(100),
      allowNull: true,
      comment : "설정 리"
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
