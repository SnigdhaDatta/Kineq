const jwt = require("jsonwebtoken");
require('dotenv').config();
const crypto = require("crypto");

function createAccessToken(user){
    const payload = {
        email:user.email,
        _id:user._id,
    }
    const Accesstoken = jwt.sign(payload, process.env.jwt_secret_key, {expiresIn:'15min'});
    return Accesstoken;
}

function createRefreshToken(){
    const refreshToken = crypto.randomBytes(64).toString('hex'); // Generate a random string as the refresh token
    return refreshToken;
}


module.exports = {
    createAccessToken,
    createRefreshToken,
}