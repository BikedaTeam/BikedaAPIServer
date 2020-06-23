module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_coordinate', {
    crdntSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "좌표 일련번호"
    },
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
    crdntLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "좌표 위도"
    },
    crdntLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "좌표 경도"
    },
  },
  {
      timestamps: true,
  });
};
