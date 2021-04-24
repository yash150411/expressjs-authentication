const jwt = require('jsonwebtoken');

const verifyUvToken = (token) => {
  return new Promise(async(resolve,reject) => {
    try{
      const decoded = await jwt.verify(token, `${process.env.SECRET_TOKEN}-customerVerification`);
      resolve(decoded);
    }catch(e){
      reject({statusCode:401, message: 'OTP Expired, Please try again'});
    }
  })
}

module.exports = {verifyUvToken};