var mongoose = require('mongoose');
const path = require("path");
var Schema = mongoose.Schema;
const BookCoverBasePath = "uplaods/BookCover";
var BookSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },
  pageCount: {
    type: Number,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  }
});
BookSchema.virtual("bookCover").get(function (){
  if (this.coverImage != null) {
    return path.join('/',BookCoverBasePath,this.coverImage)
  }
});
module.exports = mongoose.model("Book", BookSchema);
module.exports.BookCoverBasePath = BookCoverBasePath;