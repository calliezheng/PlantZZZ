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

db.User.belongsTo(db.User_Type, { 
  foreignKey: 'user_type', 
  as: 'UserType' 
});

db.User_Type.hasMany(db.User, { 
  foreignKey: 'user_type', 
  as: 'Users' 
});

db.Picture.belongsTo(db.Plant, { 
  foreignKey: 'plant_id', 
  as: 'Plant' 
});

db.Plant.hasMany(db.Picture, { 
  foreignKey: 'plant_id', 
  as: 'Pictures' 
});

db.User.hasMany(db.Plant_Remembered, { foreignKey: 'user_id' });
db.Plant_Remembered.belongsTo(db.User, { foreignKey: 'user_id' });

db.Plant.hasMany(db.Plant_Remembered, { foreignKey: 'plant_id' });
db.Plant_Remembered.belongsTo(db.Plant, { foreignKey: 'plant_id' });

db.Product.belongsTo(db.Product_Type, { 
  foreignKey: 'product_type', 
  as: 'ProductType' 
});

db.Product_Type.hasMany(db.Product, { 
  foreignKey: 'product_type', 
  as: 'Products' 
});

db.User.hasMany(db.Purchase, { foreignKey: 'user_id' });
db.Purchase.belongsTo(db.User, { foreignKey: 'user_id' });

db.Product.hasMany(db.Purchase, { foreignKey: 'product_id' });
db.Purchase.belongsTo(db.Product, { foreignKey: 'product_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;