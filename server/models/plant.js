module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('plant', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Acadamic_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Daily_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    // Model options
    tableName: 'plant', 
    timestamps: false, 
  });

  return Plant;
};
