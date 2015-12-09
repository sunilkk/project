/**
 * User.js
 *
 * @description :: User model handles user data for registration and its credentails for its authentication
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  // user authentication will be handle using PassportJS

  attributes: {
    emailid: {
      type: 'string',
      email: true,
      unique: true,
      required: true
    }, // Unique name is e-mail id of user 

    password: {
      type: sails.config.hubpassword.type,
      required: sails.config.hubpassword.required,
      minLength: sails.config.hubpassword.minLength,
      maxLength: sails.config.hubpassword.maxLength,
      hasUpperCase: sails.config.hubpassword.hasUpperCase,
      hasLowerCase: sails.config.hubpassword.hasLowerCase,
      hasNumber: sails.config.hubpassword.hasNumber,
      hasSpacialChar: sails.config.hubpassword.hasSpacialChar
    }, // Storing password in encryption form   

    passwordExpirationTime: {
      type: 'date'
    },
  
    accountStatus: {
      type: 'string',
      required: true
    }, // e.g. active, inactive, suspended, delete etc.

    numberOfWrongAttempt: {
      type: 'integer'
    },

    accountActivationTime: {
      type: 'datetime'
    }, // time of account activation through users 

    userId: {
      model: 'Businesspartner'
    },
    Id: {
      collection: 'TokenDetails',
      via: 'userId'
    }
  },

  beforeCreate: function(attrs, next) {


    var currentDate = new Date();
    attrs.passwordExpirationTime = new Date(currentDate.getTime()+sails.config.hub.expirationPeriod);
    console.log(typeof(sails.config.hubpassword.maxLength));
    console.log(typeof(sails.config.hubpassword.minLength));
    console.log(sails.config.hubpassword.minLength);
    console.log(sails.config.hubpassword.maxLength);


    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);
        attrs.password = hash;
        next();
      });
    });
  },
  beforeUpdate: function(attrs, next) {
    var currentDate = new Date();
    attrs.passwordExpirationTime = new Date(currentDate.getTime()+sails.config.hub.expirationPeriod);
    if (attrs.password) {
      var bcrypt = require('bcryptjs');
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(attrs.password, salt, function(err, hash) {
          if (err) return next(err);
          attrs.password = hash;
          next();
        });
      });
    } else next();
  }
};