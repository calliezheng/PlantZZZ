module.exports = (sequelize, DataTypes) => {
    const plant = sequelize.define("plant", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    return plant
}
