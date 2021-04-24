const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
  type: {type: String, required: true},
  email: {type: String, lowercase: true, trim: true, required:true },
  userId: {type: String},
  verificationToken: {type: String},
  otp: {type: Number},
  ip: {type: String},
  latitude: {type: String},
  longitude: {type: String},
  os: {type: String}
},{timestamps:true});

module.exports = mongoose.model('UserVerification', userVerificationSchema);