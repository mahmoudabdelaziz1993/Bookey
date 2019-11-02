const Book = require('./Book')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  author: {
    type: String,
    required: true
  }
});

AuthorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('this Author already have books'))
    } else {
      next()
    }
  })
})
module.exports = mongoose.model("Author", AuthorSchema);