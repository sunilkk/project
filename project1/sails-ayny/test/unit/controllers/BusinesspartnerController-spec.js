
var BusinesspartnerControllerTest = require('../../../api/controllers/BusinesspartnerController.js');


//Test of BusinesspartnerControllers
describe('Businesspartner Controller Test', function(){
  
    it('Index Controller', function(){

      if(!BusinesspartnerControllerTest.index){
          throw "Index Controller Not Found";
      }
      
    });


    it('View Controller', function(){

      if(!BusinesspartnerControllerTest.view){
          throw "View Controller Not Found";
      }

    });


    it('Create Controller', function(){

      if(!BusinesspartnerControllerTest.create){
          throw "Create Controller Not Found";
      }

    });


    it('Account Confirmation Controller', function(){

      if(!BusinesspartnerControllerTest.account_confirmation){
          throw "Account Confirmation Controller Not Found";
      }

    });


    it('Login Controller', function(){

      if(!BusinesspartnerControllerTest.login){
          throw "Login Controller Not Found";
      }

    });

    it('Login Passport Local Controller', function(){

      if(!BusinesspartnerControllerTest.login_passport_local){
          throw "Login Passport Local Controller Not Found";
      }

    });

    it('Logout Controller', function(){

      if(!BusinesspartnerControllerTest.logout){
          throw "Logout Controller Not Found";
      }

    });

});

