const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  password: {type: String, required: true},
},{timestamps:true});

// Before saving the user, hash the password
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);