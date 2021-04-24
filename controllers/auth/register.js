const logger = require('tracer').colorConsole();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const UserVerification = require('../../models/userVerification');
const {saveOtpAndUserData} = require('../../helpers/auth/saveOtpAndUserData');
const {sendEmailVerificationOtpMail} = require('../../local_modules/email');

class UserAuthController  {

  async registerRequest(req,res){
    const {email} = req.body;
    User.findOne({email})
    .then(async (user) => {
      try{
        // If user exists then return
        if(user) return res.status(409).json({message: 'User Exists, Please login'});
        // If user doesn't exists then create
        const otp = Math.floor(1000 + Math.random() * 9000);
        // Create token that can be passed to frontend
        const payload = {email};
        const token = jwt.sign(payload, `${process.env.SECRET_TOKEN}-customerVerification`, {expiresIn: '600s'});
        console.log(token);
        // After Creating otp and token save it and then send the otp
        await saveOtpAndUserData(otp, 'register', req, token);
        // Sending the otp after saving it in db
        sendEmailVerificationOtpMail(email,otp);
        // Sending the response
        res.status(200).json({status: true, message: 'Otp Sent', token});
      }catch(e){
        logger.log('Error while trying to save otp & user details or while sending otp', logger.error(e));
        res.status(400).json({status: false, message: 'Try again later'});
      }
    })
    .catch(err => {
      logger.error('Error Occured while fetching user', err);
      res.status(400).json({status: false, message: 'Try again later'});
    })
  }

  async registerVerify(req,res){
    const {token, otp, password} = req.body;
    if(!token || !otp || !password ) return res.status(400).json({message: 'Fields Missing'});
    if(password.length < 4) return res.status(400).json({message: 'Password too short'});
    jwt.verify(token, `${process.env.SECRET_TOKEN}-customerVerification`,(err, decoded) => {
      if(err) return res.status(401).json({message: 'OTP Expired, Please try again'})
      const {email} = decoded;
      UserVerification.aggregate([{$match: {email}},{$sort: {createdAt: -1}}])
      .then(resp => {
        const uv = resp[0];
        const ogOtp = uv.otp;
        const ogToken = uv.verificationToken;
        console.log(ogOtp, otp);
        if(ogToken === token && ogOtp === otp){
          // Its Verified
          User.findOne({email})
          .then(user => {
            if(user) return res.status(409).json({message: 'User Exists, Please login'});
            const newUser = new User();
            newUser.email = email;
            newUser.password = password;
            newUser.save()
            .then(nuSaveResp => {
              const payload = {email};
              const authToken = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '18000s'});
              res.status(201).json({message: 'User Registered', token: authToken});
            })
            .catch(err => {
              logger.error(err);
              res.status(400).json({message: 'Something went wrong, Please try again'});
            })
          })
        }else return res.status(403).json({message: 'Incorrect OTP'});
      })
      .catch(err => {
        logger.error(err);
        res.status(400).json({message: 'Something went wrong, Please try again'});
      })
    })
  }

}

module.exports =  UserAuthController;