module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('Plant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    academic_name: {
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
      defaultValue: true,
    },
  }, {
    tableName: 'plant', 
    timestamps: false, 
  });

  return Plant;
};
