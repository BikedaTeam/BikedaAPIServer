module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_ri', {
    sdCd : {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey : true,
      comment : "시도 코드"
    },
    sggCd : {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey : true,
      comment : "시군구 코드"
    },
    emdCd : {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey : true,
      comment : "읍면동 코드"
    },
    riCd : {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey : true,
      comment : "리 코드"
    },
    riNm : {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment : "리 명"
    }
  },
  {
      timestamps: true,
  });
};
