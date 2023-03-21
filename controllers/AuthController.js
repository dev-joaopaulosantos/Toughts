const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static async login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        // Confere se o usuario existe (pelo email)
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash('message', 'Usuario não encontrado!')
            res.render('auth/login')
            return
        }

        // confere se a senha é igual a cadastrada no banco
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')
            return
        }

        // inicializa a seção
        req.session.userid = user.id

        req.flash('message', 'Autenticação realizada com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })
    }

    static async register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        // verificação se a senha é igual a contra-senha
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não são iguais, tente novamente!')
            res.render('auth/register')
            return
        }
        // checa se o email já existe no banco de dados
        const checkIfUserExists = await User.findOne({ where: { email: email } })
        if (checkIfUserExists) {
            req.flash('message', 'O email informado já está cadastrado!')
            res.render('auth/register')
            return
        }

        // cria uma senha criptografada
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        // caso tudo dê certo o user é criado
        const user = {
            name,
            email,
            password: hashedPassword
        }
        try {
            // Cria o usuario no banco de dados após todas as validações
            const createdUser = await User.create(user)

            // inicializa a seção
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}