const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    }
})

Tought.belongsTo(User) // Um pensamento pertence a um usuario
User.hasMany(Tought) // Um usuario pode ter vários pensamentos

module.exports = Tought