var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var AuthorSchema = new Schema({
    author:{
      type :String,
      required: true
    } 
  });
   module.exports = mongoose.model("Author",AuthorSchema);