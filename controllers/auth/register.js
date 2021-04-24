const logger = require('tracer').colorConsole();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const UserVerification = require('../../models/userVerification');
const { saveOtpAndUserData } = require('../../helpers/auth/saveOtpAndUserData');
const { verifyUvToken } = require('../../helpers/auth/verifyUvToken');
const { saveUser } = require('../../helpers/user/saveUser');
const { sendEmailVerificationOtpMail } = require('../../local_modules/email');


class UserAuthController  {

  async registerRequest(req,res){
    try{
      const {email} = req.body;
      const user = await User.findOne({email});
      if(user) return res.status(409).json({message: 'User Exists, Please login'});
      const otp = Math.floor(1000 + Math.random() * 9000);
      const payload = {email};
      const token = jwt.sign(payload, `${process.env.SECRET_TOKEN}-customerVerification`, {expiresIn: '600s'});
      await saveOtpAndUserData(otp, 'register', req, token);
      sendEmailVerificationOtpMail(email,otp);
      res.status(200).json({status: true, message: 'Otp Sent', token});
    }catch(e){
      logger.log(e);
      res.status(400).json({status: false, message: 'Something went wrong, Please try again'});
    }
  }

  async registerVerify(req,res){
    try{
      const {token, otp, password} = req.body;
      const decoded = await verifyUvToken(token);
      const {email} = decoded;
      const userVerifications = await UserVerification.aggregate([
            {$match: {email}},
            {$sort: {createdAt: -1}}
          ]);
      const {otp:ogOtp, verificationToken:ogToken} = userVerifications[0];
      if(ogToken === token && ogOtp === otp){
        const user = await User.findOne({email});
        if(user) return res.status(409).json({message: 'User Exists, Please login'});
        await saveUser(email, password);
        const payload = {email};
        const authToken = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '18000s'});
        res.status(201).json({message: 'User Registered', token: authToken});
      }else return res.status(403).json({message: 'Incorrect OTP'});
    }catch(e){
      logger.error(e);
      if(e.message) return res.status(e.statusCode).json({message: e.message});
      res.status(400).json({message: 'Something went wrong, Please try again'})
    }
  }

}

module.exports =  UserAuthController;