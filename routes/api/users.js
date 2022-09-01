const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/authMiddleware')
const { check } = require('express-validator')
const {registerUser, updateUsername, getUserById} = require('../../controllers/usercontrollers')

// @route   GET api/users
// @desc    This is just a test route
// @access  PUBLIC => (You don't need a token to access this route)
router.get('/', (req, res) => {
    res.send('User route')
})

// @route   POST api/users
// @desc    Register user
// @access  PUBLIC => (You don't need a token to access this route)
router.post('/', [
    check('name', 'El campo "Nombre" es obligatorio').notEmpty(),
    check('email', 'Por favor incluye un mail que sea válido').isEmail(),
    check('password', 'Por favor ingresa una contraseña con más de 8 caracteres').isLength({ min: 8 })
], registerUser)

// @route   GET api/users/user/:id
// @desc    Get user by id
// @access  PUBLIC => (You don't need a token to access this route)
router.get('/user/:id', getUserById)

// @route   PUT api/users/update-username
// @desc    Update username of the current logged user
// @access  PRIVATE => (You need a token to access this route)
router.put('/update-username', [auth], updateUsername)



module.exports = router