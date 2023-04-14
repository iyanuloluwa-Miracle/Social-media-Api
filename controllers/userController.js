
require("../models/database");
//Using the module method
//import User from '../models/User'
const User = require('../models/User')
const bcrypt = require('bcryptjs');
require("dotenv").config();


exports.getAllUser = async (req, res, next) =>{
    let users;
    try{
        users = await User.find();
    } catch (err) {
        return console.log(err)
    }

    if(!users) {
        return res.status(404).json({ message: "No Users found"})
    }

    return res.status(200).json({ users })
}

//signup

exports.signup = async (req, res, next) => {
    const { name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (err) {
        return console.log(err)
    }
    if (existingUser) {
        return res.status(400).json({message: "User Already Exists! Login Instead"})
    }


    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs:[]
    })

    

    try {
       await user.save()
    } catch (err) {
       return console.log(err)
    }
    return res.status(201).json({user})
}

//Login 

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        return console.log(err)
    }
    if(!existingUser) {
        return res
         .status(404)
         .json({ message: "Couldnt Find User By this Email"})

    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect Password"})
    }
    return res.status(200).json({ message: "Login Successful"})
}