module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_rider_location', {
    riderId : {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey : true,
      comment : "라이더 ID"
    },
    riderLa : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "라이더 위도"
    },
    riderLo : {
      type: DataTypes.DECIMAL(24,20),
      allowNull: true,
      defaultValue: 0,
      comment : "라이더 경도"
    }
  },
  {
      timestamps: true,
  });
};
