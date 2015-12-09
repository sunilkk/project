// EmailService.js - in api/services

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport();
var fs = require('fs');
var ejs = require('ejs');

var smtpTransport = nodemailer.createTransport ({
        service: "gmail",
        auth: {
            user: "email@gmail.com",
            pass: "pass"
        }
});

exports.sendMail = function(data,callback) {
    var html;    
    try {
        if(data.template) {
            // TemplatePath is defind inside config/hub.js file.
            var templatePath = sails.config.hub.templatePath ;
            var template = templatePath + data.template+'.ejs';

            // fs.readFileSync read template.
            var compiled = ejs.compile(fs.readFileSync(template, 'utf8'));

            //compiled(data) set data which is require for template.
            data.html = compiled(data);
        } else {
            // You can simply print message by passing html element in data object.
            html=data.html;
          }
    

        // Sending mail 
        transport.sendMail (data,function(err,data) {
            if (err) {
                callback(err,null);
            } else {
               
                callback(null,data);
            }
        });
    } catch(e){
        callback(e,null);
      }
};

