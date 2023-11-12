const User = require('../models/users')
const catchAsysncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmails')

// Register a new user = > /api/v1/register
exports.registerUser = async (req, res, next) => {
    // console.log("hello register user")
    const { name, email, password, role } = req.body
    // console.log(`Name ${name}, password ${password}, email ${email}, role ${role}`)
    const user = await User.create({
        name,
        email,
        password,
        role
    })
   
    sendToken(user,200,res)
}

// Login user => /api/v1/login

exports.loginUser = catchAsysncErrors(async(req, res, next) =>{
    const {email, password} = req.body

    //Check if email or password is entered by user

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & Password'), 400)
    }
    
    // Finding user in database
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next (new ErrorHandler('Invalid Email or Password.', 401))
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next (new ErrorHandler('Invalid Email or Password', 401))
    }
    
    sendToken(user,200,res)

})

// Forgot Password = > /api/v1/password/forgot
exports.forgotPassword = catchAsysncErrors(async(req, res, next) =>{
    const user = await User.findOne({email : req.body.email})

    //Check user email is in database
    if(!user){
        return next(new ErrorHandler('No user found with this email.', 404))
    }

    //Get reset token
    const resetToken = user.getResetPassowrdToken()
    await user.save({validateBeforeSave :false})

    // Create reset passowrd url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your paswword reset link is as follows :\n\n${resetUrl}\n\n If you have not request this, then please ignore that`
    
    try {
        await sendEmail({
            email : user.email,
            subject : 'Jobbee- API PAssword Recovery',
            message
        })
    
        res.status(200).json({
            success : true,
            message : `Email sent successfully to : ${user.email}`
        })
        
    } catch (error) {
        user.resetPassowrdToken =undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave : false})
        return next(new ErrorHandler('Email is not sent'), 500)
    }
    
})


