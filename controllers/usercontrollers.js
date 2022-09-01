const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


const secretToken = 'jwtSecret'

const registerUser = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        // Check if the email already exists in the DB
        let user = await User.findOne({ email })

        //If the user exists...
        if (user) {
            return res.status(400).json({ errors: [{ msg: `El usuario ${email} ya existe` }] })
        } else {  // If it doesn't exists we store the new user in the DB

            // We are setting an old date to make the membership expired
            let membershipEndDate = new Date()
            membershipEndDate.setDate(membershipEndDate.getDate() - 5)
            // 1- We create the user instance
            user = new User({
                name,
                email,
                password,
                membershipEndDate
            })

            // 2- Encrypt the password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            // 3- Save the user in DB
            await user.save()

            // 4- Return a JWT
            const payload = {
                user: {
                    id: user.id // Since user.save() returns a promise we can extract the user id or _id (with mongoose it works either way)
                }
            }
            //REMEMBER TO CHANGE TIME ===> 360000 IN DEVELOPMENT ======= 3600 IN PRODUCTION
            jwt.sign(payload, secretToken, { expiresIn: 360000 }, (error, token) => {
                if (error) {
                    throw error
                } else {
                    res.json({ token }) // If there's no error we return the user token. We could also return the user id but for now its not necessary
                }
            }) //Once we have that payload we use jwt.sign() which takes 4 parameters, the payload we've created, a secret token, an expiry time and a callback
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }


}

const loginUser = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        // Check if the email already exists in the DB
        let user = await User.findOne({ email })

        //If the user does not exists...
        if (!user) {
            return res.status(400).json({ errors: [{ msg: `Usuario o contraseña incorrectos` }] })
        } else {  // If it doesn't exists we store the new user in the DB

            // 1- We check that user and password match
            const passwordAndUserMatch = await bcrypt.compare(password, user.password) //The compare() method from bcrypt takes in two parameters: the plain text password that the user types and the encrypted password from the db
            if (!passwordAndUserMatch) {
                return res.status(400).json({ errors: [{ msg: `Usuario o contraseña incorrectos` }] })
            }

            // 2- Return a JWT
            const payload = {
                user: {
                    id: user.id
                }
            }
            //REMEMBER TO CHANGE TIME ===> 360000 IN DEVELOPMENT ======= 3600 IN PRODUCTION
            jwt.sign(payload, secretToken, { expiresIn: 360000 }, (error, token) => {
                if (error) {
                    throw error
                } else {
                    res.json({ token }) // If there's no error we return the user token. We could also return the user id but for now its not necessary
                }
            }) //Once we have that payload we use jwt.sign() which takes 4 parameters, the payload we've created, a secret token, an expiry time and a callback
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }


}

//Get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
            res.status(404).send('User not found')
        }

        res.json(user)
    } catch (error) {
        console.error(error.message)

        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'User not found' })
        }
        res.status(500).send('Internal Server Error')
    }
}

const updateUsername = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { // We can get this req.user thanks to the authMiddleware
            name: req.body.name
        })

        // If there's not a user by some strange reason... maybe someone trying to do some shit on our backend 🙃
        if (!user) {
            return res.status(400).json({ msg: 'Error de usuario' })
        }

        // If there actually is a user
        res.json('Nombre actualizado correctamente')

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error')
    }
}




module.exports = {
    getUserById,
    registerUser,
    loginUser,
    updateUsername
}