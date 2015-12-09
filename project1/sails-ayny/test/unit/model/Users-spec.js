var User= require('../../../api/models/User.js');
var Businesspartner= require('../../../api/models/Businesspartner.js');


//Attribute Test
describe('User Model Testing', function () {

    it ('Email Id Attribute Test', function () {

      if(!User.attributes.emailid){
        throw "Email Id Attribute Not Found";
      }

    });

})

//Date Format check

describe('Date Format Check', function() {

  it('2015-12-12', function() {
    
  });

})
