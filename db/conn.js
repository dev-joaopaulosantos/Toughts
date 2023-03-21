const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado ao MySQL com Sucesso!')
} catch (error) {
    console.log('Erro ao conectar ao MySQL: ', error)
}

module.exports = sequelize