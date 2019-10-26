const router = require("express").Router();
const Author = require('../models/Author');
const Book = require("../models/Book");
const path = require('path');
const fs  = require('fs');
const uploadPath = path.join('public',Book.BookCoverBasePath);
const multer = require("multer");
const imageMimeTypes =['image/jpeg','image/png','image/gif']
const upload = multer({
    dest:uploadPath,
    fileFilter:(req,file,cb)=>{
        cb(null,imageMimeTypes.includes(file.mimetype));
    }
})


// All authors route  
router.get("/",async (req,res)=>{
    let searchOption = {}
    if (req.query.name) {
        searchOption.author = new RegExp(req.query.name,'i');
    }
    try {
       let books = await Book.find(searchOption);
       res.render('books/index',{books,searchOption:req.query.name});
    } catch (error) {
        res.render('/');
    }
});

// new Book 
router.get("/new",async (req,res)=>{
    renderNewBookPage(res,new Book());
});

// create new Book
router.post("/new",upload.single('cover'), async (req,res)=>{
    let fileName = req.file !=null ? req.file.filename :null ;
    const book = new Book({
        title:req.body.title,
        author:req.body.author,
        description:req.body.description,
        pageCount:req.body.pageCount,
        publishDate:new Date(req.body.publishDate),
        coverImage:fileName
    });
    try {
     await book.save();
     res.redirect('/book');
    } catch (error) {
        if (book.coverImage !=null) {
            await removeImage(book.coverImage);    
        }
       await renderNewBookPage(res,book,error);
    }});

// Delete author
router.delete("/",(req,res)=>{});


// Update author
router.put("/",(req,res)=>{});

async function renderNewBookPage(res,book,err=null){
    try {
        let authors = await Author.find({});
        let params ={authors,book}
        if(err){
            params.error_msg =" some thing went wrong try again "
        }
        res.render('books/new',params);
    } catch (error) {
        res.render('/');
    }
};

async function removeImage(fileName) {
    await fs.unlink(path.join(uploadPath,fileName),err=>{if(err) console.log(err)});
}
module.exports = router;