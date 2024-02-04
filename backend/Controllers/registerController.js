// backend/routes/user.js
const express = require('express');
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../config");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");


const registerController = {

    async signup(req, res){
        //validate

        const signupSchema = zod.object({
            email: zod.string().email(),
            userName: zod.string(),
            firstName: zod.string(),
            lastName: zod.string(),
            password: zod.string(),
            repeat_password:zod.string()
        }).refine((data) => data.password === data.repeat_password);

        const {error} = signupSchema.safeParse(req.body);
        if(error){
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            })
        }

        const exist = await User.exists({email: req.body.email});
            if(exist) {
                return res.status(411).json({
                    message: "This Email is already in use."
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //prepare the model

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,   
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });
        

        const result = await user.save();
        let access_token = jwt.sign({
            _id: result._id,
            userName: result.userName
        }, JWT_SECRET)

        const userId = result._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        res.json({
            message: "User created successfully",
            token: access_token
        })
    },

    async signin(req, res){
        
        //validate
        const signinSchema = zod.object({
            email: zod.string().email(),
            password: zod.string()
        })

        const {error} = signinSchema.safeParse(req.body)
        if(error){
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }

    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(411).json({
            message: "Email not found"
        });
    }

    //compare the password
    const match = await bcrypt.compare(req.body.password, user.password);

    if(!match){
        return res.status(401).json({
            message: "Password is wrong"
        })
    }

    let access_token;

    if (user) {
        access_token = jwt.sign({
            _id: user._id,
            userName: user.userName
        }, JWT_SECRET)
        return res.json({
            message: "signin successfully",
            token: access_token,
            _id: user._id
        });
    }
    else{
        res.status(411).json({
        message: "Error while logging in"
    })
    }
},

async update(req, res) {
    const updateSchema = zod.object({
        password: zod.string().optional(),
        firstName: zod.string().optional(),
        lastName: zod.string().optional(),
        userName: zod.string().optional(),
    });

    const { error } = updateSchema.safeParse(req.body);

    if (error) {
        return res.status(411).json({ message: "Error updating schema" });
    }

    const { password, firstName, lastName, userName } = req.body;
    
    try {
        const updateFields = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(userName && { userName }),
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        let document;
        document = await User.findOneAndUpdate(
            { _id: req.params.id },
            updateFields,
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updated document:", document);
        return res.status(201).json(document);
    } catch (error) {
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
},

    async me(req, res){
        const authHeader = req.headers.authorization; 
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    
        if (decoded && decoded._id) {
            req.userId = decoded._id; 
        }

    const user = await User.findOne({
        _id: req.userId
    });
    res.json({user});
},
    async bulk(req, res){
        const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
    }
}

module.exports = registerController;