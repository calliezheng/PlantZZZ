module.exports = (sequelize, DataTypes) => {
    const Picture = sequelize.define('picture', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      picture_file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    }, {
      tableName: 'picture', 
      timestamps: false, 
    });
  
    return Picture;
  };