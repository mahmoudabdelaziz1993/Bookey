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
    type: Buffer,
    required: true
  },
  coverImageType:{
    type:String,
    required:true
  }
});
BookSchema.virtual("bookCover").get(function (){
  if (this.coverImage != null && this.coverImageType !=null) {
    return `data:${this.coverImageType};charset =utf-8;base64,${this.coverImage.toString('base64')}`
  }
});
module.exports = mongoose.model("Book", BookSchema);
module.exports.BookCoverBasePath = BookCoverBasePath;