const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const authMiddleware = require('../../middlewares/authMiddleware')
const User = require('../../models/User')
const { loginUser } = require('../../controllers/usercontrollers')

// Whatever route that has the authMiddleware as parameter means that the route is protected

// @route   GET api/auth
// @desc    Returns the user decoded from the jwt
// @access  PRIVATE => (You need a token to access this route)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // Thanks to jwt we're getting a payload with a decoded user which contains the id. We want everything except the password.
        res.json(user)
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Internal server error')
    }
})

// @route   POST api/auth
// @desc    Login user & get token
// @access  PUBLIC => (You don't need a token to access this route)
router.post('/', [
    check('email', 'Por favor incluye un mail que sea válido').isEmail(),
    check('password', 'El campo "contraseña" es obligatorio').notEmpty()
], loginUser)

module.exports = router