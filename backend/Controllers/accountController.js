const express = require('express');
const router = express.Router();
const { Account } = require('../db');
const { mongoose } = require('mongoose');
const { authMiddleware } = require('../middlewares/middleware');

const accountController = {

    async balance(req, res){
        const account = await Account.findOne({
            userId: req.userId
        });

        res.json({
            balance: account.balance
        })
    },

    async transfer(req, res){
        const session = await mongoose.startSession();
        session.startTransaction();

    const {amount, to} = req.body;

    const account = await Account.findOne({userId: to}).session(session);

    if(!account || account.balance< amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient funds"
        })
    }

    const toAccount = await Account.findOne({userId: to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account"
        })
    }
    await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);
    

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    })
}
}

module.exports = accountController