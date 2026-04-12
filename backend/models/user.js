const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

const userSchema=new Schema({
    fullName:{
        type :String,
        required:true, 
    },
    email :{
        type : String,
        required : true,
        unique : true,
    },
    password :{
        type : String,
        required : true,
    },
    isVerified :{
        type: Boolean,
        default : false,
    },
    refreshToken : {
        type : String,
    }
}, {timestamps : true});

//hash the password before saving the user document
userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return;
    }
    //check if the user password meets the regex pattern before hashing and saving it to db
    if(!PASSWORD_REGEX.test(this.password)){
        throw Error('Password must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 special character');
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.password+process.env.password_pepper , salt);
    this.password = hashedPassword;
    return;
})



const User = model('User', userSchema);

module.exports=User;