module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    })

    return user
}

