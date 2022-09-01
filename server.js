const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')

// Initializing express
const app = express()

// Initializing middleware which used to be bodyparser to get the body of a post request. Now we can simply do this:
app.use(express.json({extended: false}))

// CORS
app.use(cors())

// Connecting with DB
connectDB();

// Routes
app.get('/', (req, res) => res.send('API Running Correctly')) // Just '/' To make sure the APP is running ok
app.use('/api/users', require('./routes/api/users'))


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT} 🔥`))