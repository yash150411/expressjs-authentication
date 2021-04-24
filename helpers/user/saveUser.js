const User = require('../../models/user');

const saveUser = (email, password) => {
  return new Promise((resolve,reject) => {
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.save()
    .then(saveResp => resolve(true))
    .catch(err => reject({statusCode:400, message: 'Could not save User', err}))
  })
}

module.exports = {saveUser};