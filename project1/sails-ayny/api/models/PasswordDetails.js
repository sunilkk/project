/**
* PasswordDetails.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	type :{
  		type: 'string',
  		required: true
  	},
  	required : {
    	type : "boolean"
  	},
    minLength : {
    	type : "integer"
    },
    maxLength : {
    	type : "integer"
    },
    hasUpperCase : {
    	type : "boolean"
    },
    hasLowerCase : {
    	type : "boolean"
    },
    hasNumber : {
    	type : "boolean"
    },
    hasSpecialChar : {
      type : "boolean"
    }
  },

   afterCreate: function(attrs, next) {
   		sails.config.hubpassword.type = attrs.type,
   		sails.config.hubpassword.required = attrs.required,
   		sails.config.hubpassword.minLength = attrs.minLength,
   		sails.config.hubpassword.maxLength = attrs.maxLength,
   		sails.config.hubpassword.hasUpperCase = attrs.hasUpperCase,
   		sails.config.hubpassword.hasLowerCase = attrs.hasLowerCase,
      sails.config.hubpassword.hasNumber = attrs.hasNumber,
   		sails.config.hubpassword.hasSpecialChar = attrs.hasSpecialChar
   },
   afterUpdate: function(attrs, next) {
    console.log(attrs);
   		sails.config.hubpassword.type = attrs.type,
   		sails.config.hubpassword.required = attrs.required,
   		sails.config.hubpassword.minLength = attrs.minLength,
   		sails.config.hubpassword.maxLength = attrs.maxLength,
   		sails.config.hubpassword.hasUpperCase = attrs.hasUpperCase,
   		sails.config.hubpassword.hasLowerCase = attrs.hasLowerCase,
   		sails.config.hubpassword.hasNumber = attrs.hasNumber,
      sails.config.hubpassword.hasSpecialChar = attrs.hasSpecialChar
   }
};

