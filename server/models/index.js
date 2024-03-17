'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.user.belongsTo(db.user_type, { 
  foreignKey: 'User_Type', // Ensure this matches the foreign key column in 'user' table
  as: 'UserType' // Alias for including in queries
});

db.user_type.hasMany(db.user, { 
  foreignKey: 'User_Type', // Ensure this matches the foreign key column in 'user' table
  as: 'Users' // Alias for including in queries
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;