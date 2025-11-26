// const mongoose = require('mongoose');

// // ye yahan pe use kiya gya hai for unique identification.
// const userSchema = new mongoose.Schema({
//     phoneNumber: { type: String, unique: true , sparse: true},

//     // phonenumber unique ho isiliye OTP verificaton.
//     phoneSuffix: { type: String, unique: false},  
//     username:{type: String},

//     // email verifcation ke liye with Otp.
//     email:{
//         type: String,
//         lowercase: true,
//         validate: {
//             validator: function(value) {
//             return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//         },
//         message: "Invalid email format",
//     },
// },
// // This field is for OTP verification of email
// // and various feature as you can see below.
// emailOtp: { type: String },
// emailOtpExpiry: { type: Date },
// profilePicture: { type: String },
// about: { type: String },
// lastSeen: { type: Date },
// isOnline: { type: Boolean, default: false },
// isVerified: { type: Boolean, default: false },
// agreedToTerms: { type: Boolean, default: false },
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);
// module.exports = User; 

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');   // ⭐ needed for token

// Schema
const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, sparse: true },
    phoneSuffix: { type: String, unique: false },
    username: { type: String },

    email: {
        type: String,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format",
        },
    },

    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },

    profilePicture: { type: String },
    about: { type: String },
    lastSeen: { type: Date },
    isOnline: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    agreedToTerms: { type: Boolean, default: false },

}, { timestamps: true });


// ⭐ ADD THIS — JWT Token generator method
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,  // must be set in .env
        { expiresIn: "7d" }
    );
};


// Export model
const User = mongoose.model('User', userSchema);
module.exports = User;
