const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    },
    lastPayment: {
        type: Date,
        default: '2019-07-15T22:42:29.000+00:00',
    },
    membershipEndDate: {
        type: Date,
        default: Date.now()
    },

    hasVerifiedMail: {
        type: Boolean,
        default: false
    }
})

module.exports = User = mongoose.model('User', UserSchema)