const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/totalbikes'

const connectDB = async () => {
    try {
        //Production
     /*    await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            "auth": {
                "authSource": "admin"
            },
            "user": "root",
            "pass": "contrasena"
        })
        console.log('MongoDB Connected 🚀') */

        // Development
       await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        console.log('MongoDB Connected 🚀') 

    } catch (error) {
        console.log(error.message)
        //If there was an error we should exit the process with failure:
        process.exit(1)
    }
}

module.exports = connectDB