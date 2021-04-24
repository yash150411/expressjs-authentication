const nodeMailer = require('nodemailer');
const logger = require('tracer').colorConsole();
var dotenv = require("dotenv")
dotenv.config()

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASS
  }
});

function sendEmailVerificationOtpMail(email, otp){
  return new Promise(async(resolve,reject) => {
    try{
      const mailResp = await transporter.sendMail({
        from: `"Express-Authenticate" <${process.env.GMAIL_ID}>`, // sender address
        to: email, // list of receivers
        subject: "Express-Authenticate Email Verification", // Subject line
        html: `<b>Your Email Verification OTP is : ${otp}</b>`, // html body
      });
      if(mailResp){resolve(true), logger.log('Mail Sent')};
    }catch(e){
      logger.error(e);
    }
  })
}

module.exports = {sendEmailVerificationOtpMail};