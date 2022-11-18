const User = require('../models/User')
const bcrypt = require('bcrypt')

const register = async (req, res, next) => {

    try {
        const { username, email, password } = req.body

        const usernameCheck = await User.findOne({ username })

        if (usernameCheck) {
            return res.send({ msg: "Usuario o Email existente", status: false })
        }

        const emailCheck = await User.findOne({ email })

        if (emailCheck) {
            return res.send({ msg: "Usuario o Email existente", status: false })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(200).send({ status: true, msg: "Te has registrado", user: newUser })

    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {

    try {
        const { username, password } = req.body

        const user= await User.findOne({ username })

        if (!user) {
            return res.send({ msg: "Usuario o Contraseña inválido", status: false })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.send({ msg: "Usuario o Contraseña inválido", status: false })
        }

        return res.status(200).send({ status: true, msg: "Te has logueado", data: user })

    } catch (error) {
        next(error)
    }

}

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })

        return res.status(200).send({
            isSet: userData.isAvatarImageSet, 
            image: userData.avatarImage
        })

    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    
  try {
    const users = await User.find({_id:{$ne:req.params.id}}).select([
        "email", 
        "username", 
        "avatarImage", 
        "_id",
    ])

    return res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, setAvatar, getAllUsers }