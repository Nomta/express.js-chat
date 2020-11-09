var crypto = require('crypto')
var mongoose = require('../connection')
var AuthError = require('../error/AuthError')

var schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
})

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password
        this.salt = Math.random() + ''
        this.passwordHash = this.encryptPassword(password)
    })
    .get(function() {
        return this._plainPassword
    })

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.passwordHash
}

schema.statics.authorize = async function(username, password) {
    if (!username || !password) {
      throw new AuthError('Uncorrect data')
    }

    var User = this
  
    try {
      var user = await User.findOne({ username })
    
      if (user) {
        if (user.checkPassword(password)) {
            return user
        }
        else {
          throw new AuthError('Uncorrect password')
        }
      }
      else {
        try {
          var user = await User.create({ username, password })
          return user
        }
        catch(err) {
          throw err
        }
      }
    }
    
    catch(err) {
      throw err
    }
}

module.exports = mongoose.model('User', schema)