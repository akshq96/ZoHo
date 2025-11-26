// const twillo = require('twilio');

// // Twilio configuration

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceSid = process.env.TWILIO_SERVICE_SID;

// const client = twillo(accountSid, authToken);

// // Function to send OTP via Twilio
// const sendOtpViaTwilio = async (phoneNumber) => {
//     try {
//         console.log("Sending OTP to:", phoneNumber);
//         if (!phoneNumber) {
//             throw new Error("Phone number is required to send OTP");
//         }
//         const response = await client.verify.v2.services(serviceSid)
//             .verifications
//             .create({ to: phoneNumber, channel: 'sms' });
//         console.log("Twilio response:", response);
//         return response;
//     } catch (error) {
//         console.error( error);
//         throw new Error("Failed to send OTP");
//     }
// }
// // Function to verify OTP via Twilio
// const verifyOtp = async (phoneNumber,otp) => {
//     try {
//         console.log("this is otp", otp);
//         console.log("Verifying OTP for:", phoneNumber);
//         const response = await client.verify.v2.services(serviceSid)
//             .verificationChecks
//             .create({ to: phoneNumber, code: otp });
//         console.log("otp response:", response);
//         return response;
//     } catch (error) {
//         console.error( error);
//         throw new Error("otp verification failed");
//     }
// };
// module.exports = {
//     sendOtpViaTwilio,
//     verifyOtp
// };

require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendOtpViaTwilio = async (phoneNumber) => {
    return client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .verifications.create({ to: phoneNumber, channel: "sms" });
};

const verifyOtp = async (phoneNumber, otp) => {
    return client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
        .verificationChecks.create({ to: phoneNumber, code: otp });
};

module.exports = { sendOtpViaTwilio, verifyOtp };

