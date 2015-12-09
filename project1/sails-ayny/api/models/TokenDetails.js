/**
* TokenDetails.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	generationTime :{
      type: 'date',
  	},
  	isExpired :{
      type: 'boolean'
  	},
  	expirationTime: {
      type: 'date',
    },
    userId: {
      model: 'User',
      required: true
    }
  },

   	beforeCreate: function(attrs, next) {
   		var currentDate = new Date();
   		attrs.generationTime = currentDate;
   		attrs.expirationTime = new Date(currentDate.getTime()+(2*24*60*60*1000));
   		attrs.isExpired = false;
   		next();
   	},

   	beforeUpdate: function(attrs, next) {
   		var currentDate = new Date();
   		attrs.generationTime = currentDate;
   		attrs.expirationTime = new Date(currentDate.getTime()+(2*24*60*60*1000));
   		// attrs.expirationTime = new Date(currentDate.getTime()+(30*1000));
   		next();
   	}
};

