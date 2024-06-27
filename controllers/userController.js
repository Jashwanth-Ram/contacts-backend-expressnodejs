const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register user
//@route post /api/users/register
//@access public
const registerUser =asyncHandler( async (req,res)=>{

    const {username,email,password} = req.body;
    if(!username || !email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory !")  
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable)
    {
        res.status(400);
        throw new Error("User Already registered !"); 
    }

    //Hash password-
    const hashPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        username,
        email,
        password:hashPassword,
    })
    console.log(`User created successfully ${user}`);
    // sending back info to user
    if(user)
    {
        res.status(201).json({_id:user.id,email:user.email});
    }
    else
    {
        res.status(400);
        throw new Error("User data not valid");
    }
    res.json({message:"Register the user"})
})

//@desc Login user
//@route post /api/users/login
//@access public
const loginUser =asyncHandler( async (req,res)=>{

    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const user = await User.findOne({email});
    //compare password with hashedpassword
    if(user && (await bcrypt.compare(password,user.password)))
    {
        const accesstoken = jwt.sign(
        {
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },

        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    );
        res.status(200).json({accesstoken})
    }
    else 
    {
        res.status(401);
        throw new Error("Email or password is not valid");
    }

    res.json({message:"User logged in successfully"})
})

//@desc Current user Info
//@route post /api/users/current
//@access private
const currentUser =asyncHandler( async (req,res)=>{
    res.json(req.user)
})


module.exports = {registerUser,loginUser,currentUser};