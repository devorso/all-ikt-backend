

const mongoose = require('mongoose');
const crypto = require("crypto");
const UserPreferences = require('./UserPreferences');
const schema = new mongoose.Schema(
    {
        
    firstname: { type: String, default:''}, 
    lastname:   { type: String, default:''}, 
    username:  { type: String, default:''}, 
    email:   { type: String, default:''},  
    birthday:  { type: mongoose.Schema.Types.Date, default:''},  
    city:   { type: String, default:''},  
    numberPhone:   { type: String, default:''},  
    password:    { type: String, default:''},  
    preferences:{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPreferences' },
    favouritesCity: [{type: String}],
    salt:{type:String}

}
    
    );
    // Method to set salt and hash the password for a user 
    schema.methods.setPassword = function(password) { 
     
    
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 
        
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
       this.password = this.hash;
   }; 
     
   // Method to check the entered password is correct or not 
   schema.methods.validPassword = function(password) { 
       if (this.salt === undefined ) return false
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
     
       return this.password === hash; 
   }; 
module.exports = mongoose.model('User', schema);