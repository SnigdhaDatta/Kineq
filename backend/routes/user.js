const {Router}= require("express");
const User = require("../models/user");
const UserRouter = Router();
const {createAccessToken, createRefreshToken} = require("../services/authentication");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require('dotenv').config();

UserRouter.post("/signup", async (req,res)=>{
    try {
        const {fullName, email, password, isVerified} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({error: 'No need to Signup as user with this email already exists. Please login instead.'});
        }
        if(!fullName || !email || !password || typeof isVerified === 'undefined'){
            return res.status(400).json({error: 'Please Provide all the required Fields'});
        }
        const user = await User.create({fullName, email, password, isVerified});
        res.status(201).json({message: 'User created successfully, now login with your credentials'});
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

UserRouter.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: 'All fields required'});
        }
    
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({error: 'User not found'});
        }
        const isPasswordMatch = await bcrypt.compare(password+process.env.password_pepper, existingUser.password);
        if(!isPasswordMatch){
            return res.status(401).json({error: 'Invalid credentials, Give correct email and password to login'});
        }
        const accesstoken = createAccessToken(existingUser);
        res.setHeader('Authorization', `Bearer ${accesstoken}`); // Set the token in the response header
        
        const refreshToken = createRefreshToken();
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.refresh_token_pepper).update(refreshToken).digest('hex');
        existingUser.refreshToken = hashedRefreshToken;
        await existingUser.save();

        //in production set secure: true and sameSite: 'none' to allow cross-site cookies, in development you can set secure: false and sameSite: 'lax'
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set the cookie to expire in 7 days from now
            path: '/' //path '/' means the cookie will be sent in all requests to the server, you can adjust it based on your needs
        }); // Set the refresh token in an HTTP-only cookie
        
        return res.status(200).json({message: 'Login successful'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})


UserRouter.post("/logout", async (req,res)=>{
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            res.cookie.clearCookie('refreshToken', { path: '/' });
            return res.status(400).json({error: 'REFRESH_EXPIRED'});
        }
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.refresh_token_pepper).update(refreshToken).digest('hex');

        if (hashedRefreshToken ) {
            await User.updateOne({ refreshToken: hashedRefreshToken }, { $unset: { refreshToken: "" } });
        }

        res.removeHeader('authorization'); // Clear the token from the response header
        res.clearCookie('refreshToken', { path: '/' }); // Clear the refresh token cookie
        return res.status(200).json({message: 'Logout successful'});
    }catch(error){
        res.status(500).json({error: error.message});
    }

})

module.exports=UserRouter;