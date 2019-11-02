const router = require("express").Router();
const Author = require('../models/Author');
const Book = require("../models/Book");
const path = require('path');
const fs = require('fs');
// const uploadPath = path.join('public',Book.BookCoverBasePath);
// const multer = require("multer");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// const upload = multer({
//     dest:uploadPath,
//     fileFilter:(req,file,cb)=>{
//         cb(null,imageMimeTypes.includes(file.mimetype));
//     }
// })


// All authors route  
router.get("/", async (req, res) => {
    let searchOption = {}
    if (req.query.name) {
        searchOption.author = new RegExp(req.query.name, 'i');
    }
    try {
        let books = await Book.find(searchOption);
        res.render('books/index', { books, searchOption: req.query.name });
    } catch (error) {
        res.render('/');
    }
});

// perview single book 
router.get("/preview/:id", async (req, res) => {
    try {
        let book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/preview', { book });
    } catch (error) {
        res.redirect('/book');
    }
})


// new Book 
router.get("/new", (req, res) => {
    renderNewBookPage(res, new Book());
});

//get edit page 
router.get('/edit/:id', async (req, res) => {
    try {
        let book = await Book.findById(req.params.id).populate("author").exec();
        let params = {
            authors: [book.author],
            book
        };
        res.render('books/edit', params);
    } catch (error) {
        res.redirect('/author');
    }
})

// create new Book
router.post("/new", async (req, res) => {
    // let fileName = req.file !=null ? req.file.filename :null ;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        pageCount: req.body.pageCount,
        publishDate: new Date(req.body.publishDate)
    });

    bookCoverSave(book, req.body.cover);
    try {
        await book.save();
        res.redirect('/book');
    } catch (error) {
        // if (book.coverImage !=null) {
        //     await removeImage(book.coverImage);    
        // }
        await renderNewBookPage(res, book, error);
    }
});


// Delete author
router.delete("/delete/:id", async (req, res) => {
    try {
        await Book.findByIdAndRemove(req.params.id);
        res.redirect('/book');
    } catch (error) {
        res.redirect('/book');
    }
 });


// Update author
router.put("/edit/:id", async (req, res) => {
    try {
        let book =  await bookWrap(req.body);
        await Book.findByIdAndUpdate(req.params.id, book ,{new:true});
        res.redirect(`/book/preview/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.redirect(`/book/edit/${req.params.id}`);
    }
});

async function renderNewBookPage(res, book, err = null) {
    try {
        let authors = await Author.find({});
        let params = { authors, book }
        if (err) {
            params.error_msg = " some thing went wrong try again "
        }
        res.render('books/new', params);
    } catch (error) {
        res.render('/');
    }
};

// async function removeImage(fileName) {
//     await fs.unlink(path.join(uploadPath,fileName),err=>{if(err) console.log(err)});
// }
async function bookWrap(body) {
    const book = {
        title: body.title,
        author: body.author,
        description: body.description,
        pageCount: body.pageCount,
        publishDate: new Date(body.publishDate)
    };
    try {
        await bookCoverSave(book, body.cover);
        return book ;
    } catch (error) {
        return 
    }
}
async function bookCoverSave(book, encodedCover) {
    if (encodedCover == null) return
    const cover = JSON.parse(encodedCover);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}
module.exports = router;