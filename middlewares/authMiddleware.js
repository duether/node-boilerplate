const jwt = require('jsonwebtoken')

const secretToken = 'jwtSecret'

// We export a middleware function ===> this type of function takes in 3 parameters. It has access to the req and res objects and then "next" is actually a callback that we have to run once it's done so that it moves on to the next piece of middleware or it continues with whatever logic we are implementing
module.exports = (req, res, next) => {
    // Getting the token from the header ===> when we send a request to a protected route we want to send the token within a header
    const token = req.header('x-auth-token')

    // Checking if there's no token
    if (!token) {
        return res.status(401).json({msg: 'No token available. Authorization denied'})
    }

    // Verifying the token in case there is actually one
    try {
        const decoded = jwt.verify(token, secretToken) // This decodes the token
        req.user = decoded.user // Then we'll be able to use this user in any of the protected routes
        next()
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'})
    }

}