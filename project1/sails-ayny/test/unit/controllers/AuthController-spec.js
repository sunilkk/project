
var AuthControllerTest = require('../../../api/controllers/AuthController.js')


//Test of AuthControllers
describe('AuthController Controller Test', function(){
  
    it('Github Controller', function(){

      if(!AuthControllerTest.github){
          throw "Github Controller Not Found";
      }

    });


    it('Facebook Controller', function(){

      if(!AuthControllerTest.facebook){
          throw "Facebook Controller Not Found";
      }

    });


    it('Google Controller', function(){

      if(!AuthControllerTest.google){
          throw "Google Controller Not Found";
      }

    });


    it('Twitter Controller', function(){

      if(!AuthControllerTest.twitter){
          throw "Twitter Controller Not Found";
      }

    });
  
});
