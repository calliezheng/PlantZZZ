module.exports = (sequelize, DataTypes) => {
    const PlantRemembered = sequelize.define('Plant_Remembered', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'user', 
            key: 'id',
          },
      },
      plant_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'plant', 
            key: 'id',
          },
    },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    }, {
      tableName: 'plant_remembered', 
      timestamps: false, 
    });
  
    return PlantRemembered;
  };
  