const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email:String,
    password: String,
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}