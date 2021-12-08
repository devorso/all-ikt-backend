/**
 * 
 * preferences:
 *  max_distance_km  => 0  : illimite
 * climat_choice => multiple
 */

 const mongoose = require('mongoose')
 const Schema = mongoose.Schema
 
 
 const userPreferences = new Schema(
     {
         allow_regions_only:[{type:String}],
         exclude_city: [{type: String}]
     }
 );
 
 module.exports = mongoose.model('UserPreferences',userPreferences)