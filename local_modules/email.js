const nodeMailer = require('nodemailer');
const logger = require('tracer').colorConsole();
var dotenv = require("dotenv")
dotenv.config()

let transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASS
  }
});

async function sendEmailVerificationOtpMail(email, otp){
  return new Promise(async(resolve,reject) => {
    let mailOptions = await transporter.sendMail({
      from: `"Express-Authenticate" <${process.env.GMAIL_ID}>`, // sender address
      to: email, // list of receivers
      subject: "Express-Authenticate Email Verification", // Subject line
      html: `<b>Your Email Verification OTP is : ${otp}</b>`, // html body
    });
    
    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
        logger.log(error);
        resolve(false);
      }else{
        logger.log('Mail Sent');
        resolve(true);
      }
    });
  })
}

module.exports = {sendEmailVerificationOtpMail};