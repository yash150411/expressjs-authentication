const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const {saveOtpAndUserData} = require('../../helpers/auth/saveOtpAndUserData');

class Login  {

  async login(req,res){
    const {email, password} = req.body;
    User.findOne({email})
    .then(user => {
      if(!user) return res.status(404).json({message: 'User not found'});
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch)  return res.status(403).json({message: 'Incorrect Password'}); 
        saveOtpAndUserData(undefined, 'login' , req, undefined);
        const payload = {email: user.email};
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '18000s'});
        res.status(200).json({status:true, message:'Login Successful', token });
      });
    })

  }

}

module.exports =  Login;