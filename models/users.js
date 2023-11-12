const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'PLease enter your name']
    },
    email : {
        type :  String,
        required : [true, 'Please enter your email address'],
        unique : true,
        // validate : [validator.isEmail, 'Please enetr Valide email adrees']
    },
    role : {
        type : String,
        enum : {
            values : ['user','employeer'],
            message : 'Please select correct riole'
        },
        default : 'user',
        
    },
   
    password : {
     type : String,
     required : [true, 'Please enter password for your account'],
     minlength : [8, 'Your password must be at least 8 character long'],
     select : false
    },
    createdAt : {
        type : Date,
        default: Date.now
    },
    resetPassowrdToken : String,
    resetPasswordExpire : Date
})

// Encrypting Password before saving to DB.
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//Return JSON WEB TOKEN
userSchema.methods.getJwtToken = function(){  
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_TIME})
    }

// Compare user password in database password
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

// Generate Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash and set to resetPasswordToken
    this.resetPassowrdToken = crypto
                        .createHash('sha256')
                        .update(resetToken)
                        .digest('hex')
    // Set token expiry time
    this.resetPasswordExpire = Date.now() + 30*60*1000
    return resetToken
}

module.exports = mongoose.model('User', userSchema)