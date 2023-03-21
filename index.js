const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()
const conn = require('./db/conn')

// Importando Models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Importando rotas
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Importando Controller, usado para mostrar todas as toughts na rota '/'
const ToughtController = require('./controllers/ToughtController')

// Arquivos publicos
app.use(express.static('public'))

// Template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receber resposta do body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Flash messages
app.use(flash())

// Session middlewares
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    }
}))

// Config seção na resposta
app.use((req, res, next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})

// Rotas
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts) // serve para mostrar todas os toughts na rota '/'

conn.sync().then(() => {
    app.listen(3000)
}).catch((err) => {
    console.log(err)
});