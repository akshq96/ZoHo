 
    // const User = require("../models/User"); // DB se User model import
    // const { sendOtpToEmail } = require("../services/emailService");
    // const { otpGenerater } = require("../utils/otpGenerator"); // OTP generate karne wala function
    // const response = require('../utils/responseHandler');// Standard API response helper
    // const twilioService = require("../services/twilioService"); // Twilio SMS service
    
    // const sendOtp = async (req, res) => {
    //     const {phoneNumber,phoneSuffix,email} = req.body; // User se phone/email input mil raha hai
    //     const otp = otpGenerater(); // Naya random OTP generate
    //     const expiry = new Date(Date.now() + 5 * 60 * 1000); // OTP 5 minutes tak valid
    //     let user; // User variable jisme DB user store hoga
    
    //     try{
    //         if(email){ // Agar email diya gaya hai to email OTP flow chalega
    //             user = await User.findOne({ email}); // Email se user search
    //             if(!user){
    //                 user = new User({ email}); // User nahi mila to new user create
    //             } 
    //             user.emailOtp = otp; // User ke record me OTP save
    //             user.emailOtpExpiry = expiry; // OTP expiry time save
    //             await user.save(); // DB me user save
    //             await sendOtpToEmail(email, otp); // Email service se OTP bhejo
    //             return response(res, 200, "OTP sent to email", { email }); // Success response
    //         }
    
    //         if(!phoneNumber || !phoneSuffix){ // Phone login me dono fields required
    //             return response(res, 400, "Phone number and phone Suffix is required");
    //         }
    
    //         const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`; // Country code + number combine
    //         user = await User.findOne({ phoneNumber}); // Phone number se user search
    //         if(!user){
    //             user = await new User({ phoneNumber, phoneSuffix}); // User nahi mila to new user create
    //         }
    //         await twilioService.sendOtpToPhoneNumber(fullPhoneNumber); // Twilio service se OTP SMS bhejo
    //         await user.save(); // DB me user save
    //         return response(res, 200, "OTP sent to phone number", user); // Success response
    
    //     } catch (error) {
    //         console.error("Error in sendOtp:", error); // Debugging ke liye error print
    //         return response(res, 500, "Internal Server Error"); // Server error response
    //     }
    // }

    // const verifyOtp = async (req, res) => {
    //     const { phoneNumber, phoneSuffix, email, otp } = req.body; // User se input mil raha hai

    //     try {
    //         let user; // User variable jisme DB user store hoga
    //         if(email){
    //             user = await User.findOne({ email }); // Email se user search
    //             if (!user) {
    //                 return response(res, 404, "User not found with this email");
    //             }
    //             const now = new Date();
    //             if (user.emailOtp || String(user.emailOtp) !==String(otp) ||  now > new Date(user.emailOtpExpiry)) {
    //                 return response(res, 400, "Invalid or expired OTP for email");
    //             };
    //             user.isVerified = true; // User verified mark karo  
    //             user.emailOtp = null; // OTP clear karo
    //             user.emailOtpExpiry = null; // OTP expiry clear karo
    //             await user.save(); // DB me user save
    //         }
    //         else {
    //             if (!phoneNumber || !phoneSuffix) {
    //                 return response(res, 400, "Phone number and phone Suffix is required");
    //             }
    //             const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`; // Country code + number combine
    //             user = await User.findOne({ phoneNumber }); // Phone number se user search
    //             if (!user) {
    //                 return response(res, 404, "User not found with this phone number");
    //             }
    //             const result = await twilioService.verifyOtpForPhoneNumber(fullPhoneNumber, otp); // Twilio service se OTP verify karo
    //             if (result.status !== "approved") {
    //                 return response(res, 400, "Invalid or expired OTP for phone number");
    //             }
    //             user.isVerified = true; // User verified mark karo
    //             await user.save(); // DB me user save
    //         }
    //         const token = user.generateToken(user?._id); // JWT token generate karo
    //         res.cookie("auth_token", token, {
    //             httpOnly: true,
    //             maxAge: 1000 * 60 * 60 * 24 * 365 // 7 days
    //         });
    //         return response(res, 200, "OTP verified successfully", { user, token }); // Success response
    //     } catch (error) {
    //         console.error("Error in verifyOtp:", error); // Debugging ke liye error print
    //         return response(res, 500, "Internal Server Error"); // Server error response
    //     }
    // }; 

    // module.exports = {
    //     sendOtp,
    //     verifyOtp,
    // };
             
const User = require("../models/User"); // DB se User model import
const { sendOtpToEmail } = require("../services/emailService"); // Email OTP bhejne wala service
const { otpGenerater } = require("../utils/otpGenerator"); // Random OTP generate karta hai
const response = require('../utils/responseHandler'); // Standard response helper
const twilioService = require("../services/twilioService"); // Twilio SMS OTP service

//         SEND OTP CONTROLLER

const sendOtp = async (req, res) => {
    const { phoneNumber, phoneSuffix, email } = req.body; // User ka input email/phone
    const otp = otpGenerater(); // Naya OTP generate
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // OTP 5 mins tak valid

    try {
        let user;

        //  EMAIL OTP FLOW
        if (email) { // Agar user ne email diya hai
            user = await User.findOne({ email }); // Email se user dhundo

            if (!user) user = new User({ email }); // Agar nahi mila toh new user banao

            user.emailOtp = otp; // OTP save
            user.emailOtpExpiry = expiry; // OTP expiry save
            await user.save(); // DB me update/save

            await sendOtpToEmail(email, otp); // Email me OTP bhejo

            return response(res, 200, "OTP sent to email", { email }); // Success response
        }

        //  PHONE OTP FLOW 
        if (!phoneNumber || !phoneSuffix) { // Phone OTP ke liye dono required
            return response(res, 400, "Phone number and phone Suffix is required");
        }

        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`; // Country code + phone number

        user = await User.findOne({ phoneNumber }); // Phone number se user dhundo
        if (!user) user = new User({ phoneNumber, phoneSuffix }); // Not found → new user

        await twilioService.sendOtpViaTwilio(fullPhoneNumber); // Twilio se SMS OTP bhejna

        await user.save(); // DB me save

        return response(res, 200, "OTP sent to phone number", { phoneNumber }); // Success
    } catch (error) {
        console.error("Error in sendOtp:", error); // Debugging
        return response(res, 500, "Internal Server Error");
    }
};

//        VERIFY OTP CONTROLLER
const verifyOtp = async (req, res) => {
    const { phoneNumber, phoneSuffix, email, otp } = req.body; // User input for verify

    try {
        let user;

        //  EMAIL OTP VERIFY FLOW 
        if (email) { // Agar email verify karna hai
            user = await User.findOne({ email }); // Email se user dhundo

            if (!user) return response(res, 404, "User not found with this email");

            const now = new Date();

            // OTP match aur expiry check
            if (
                !user.emailOtp || // OTP exist hona chahiye
                String(user.emailOtp) !== String(otp) || // OTP match hona chahiye
                now > new Date(user.emailOtpExpiry) // OTP expire nahi hona chahiye
            ) {
                return response(res, 400, "Invalid or expired OTP for email");
            }

            user.isVerified = true; // User verify
            user.emailOtp = null; // OTP clear
            user.emailOtpExpiry = null; // Expiry clear
            await user.save(); // Save
        }

        //  PHONE OTP VERIFY FLOW 
        else {
            if (!phoneNumber || !phoneSuffix)
                return response(res, 400, "Phone number and phone Suffix is required");

            const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`; // Complete number
            user = await User.findOne({ phoneNumber }); // DB me user dhundo

            if (!user)
                return response(res, 404, "User not found with this phone number");

            const result = await twilioService.verifyOtp(fullPhoneNumber, otp); // Twilio se verify karo

            if (result.status !== "approved") {
                return response(res, 400, "Invalid or expired OTP for phone number");
            }

            user.isVerified = true; // Verified mark
            await user.save(); // Save
        }

        // TOKEN GENERATE & COOKIE SET 
        const token = user.generateToken(user._id); // JWT token generate
        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 86400 * 1000, // 24 hrs
        });

        return response(res, 200, "OTP verified successfully", { user, token }); // Final success
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return response(res, 500, "Internal Server Error");
    }
};
const updateProfile = async (req, res) => {
     // Profile update logic here
    const {username, agreedToTerms,about} = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user

    try{
        const user = await User.findById(userId);
        const file = req.file;
        if(file){
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: 'profile_pictures',
                width: 150,
                crop: "scale"
            });
        }
    }catch(error){
        console.error("Error in updateProfile:", error);
        return response(res, 500, "Internal Server Error");
    }
};

// Export controllers
module.exports = { sendOtp, verifyOtp };
