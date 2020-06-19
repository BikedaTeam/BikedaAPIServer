'use strict';
require('dotenv').config();
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.branch = require('./branch')(sequelize, Sequelize);
db.branch_point = require('./branch_point')(sequelize, Sequelize);
db.branch_share = require('./branch_share')(sequelize, Sequelize);

db.store = require('./store')(sequelize, Sequelize);
db.store_point = require('./store_point')(sequelize, Sequelize);
db.store_surcharge = require('./store_surcharge')(sequelize, Sequelize);
db.store_area_setting = require('./store_area_setting')(sequelize, Sequelize);
db.store_distance_setting = require('./store_distance_setting')(sequelize, Sequelize);
db.store_special_setting = require('./store_special_setting')(sequelize, Sequelize);
db.store_special_location = require('./store_special_location')(sequelize, Sequelize);

db.rider = require('./rider')(sequelize, Sequelize);
db.rider_point = require('./rider_point')(sequelize, Sequelize);
db.rider_location = require('./rider_location')(sequelize, Sequelize);

db.delivery = require('./delivery')(sequelize, Sequelize);

module.exports = db;
