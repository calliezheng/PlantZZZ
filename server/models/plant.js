module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('plant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    acadamic_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    daily_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: 'plant', 
    timestamps: false, 
  });

  return Plant;
};
