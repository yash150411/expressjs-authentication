const UserVerification = require('../../models/userVerification');
const saveOtpAndUserData = (otp, type , req, token) => {
  return new Promise((resolve, reject) => {
    const {email, ip, os, latitude, longitude} = req.body;
    const cv = new UserVerification();
    cv.email = email;
    cv.type = type;
    cv.ip = ip;
    cv.os = os;
    cv.latitude = latitude;
    cv.longitude = longitude;
    cv.otp = otp;
    cv.verificationToken = token;
    cv.save()
    .then(saveResp => resolve(true))
    .catch(err => reject(err))
  })
};

module.exports = {saveOtpAndUserData};