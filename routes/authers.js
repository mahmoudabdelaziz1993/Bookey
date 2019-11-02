const router = require("express").Router();
const Author = require('../models/Author');
const Book = require('../models/Book');


// All authors route  
router.get("/",async (req,res)=>{
    let searchOption = {}
    if (req.query.name) {
        searchOption.author = new RegExp(req.query.name,'i');
    }
    try {
       let authors = await Author.find(searchOption);
       res.render('authors/index',{authors,searchOption:req.query.name});
    } catch (error) {
        res.render('/');
    }
});

// new author
router.get("/new",(req,res)=>res.render('authors/new',{author:new Author()}));

// create new author
router.post("/new", async (req,res)=>{
    try {
      await new Author(req.body).save();
      res.redirect('/author');  
    } catch (error) {
        res.render("authors/new",{error_msg:error})
    }});

// Delete author
router.delete("/delete/:id",async (req,res)=>{
    let author
    try {
        author  = await  Author.findById(req.params.id);
        await author.remove();
        res.redirect('/author')
    } catch (error) {
        if(author == null){
            res.redirect('/');
        }else{
            res.redirect(`/author/preview/${author.id}`);
        }
    }
});

// edit page 
router.get("/edit/:id",async (req,res)=>{
    try {
        let author  = await Author.findById(req.params.id);
        if(author != null )
            res.render('authors/edit',{author})
    } catch (error) {
        res.redirect('/author')
    }
    
});

// Update author
router.put("/edit/:id",async (req,res)=>{
    try {
        let author  = await Author.findById(req.params.id);
        if(author != null )
        await Author.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.redirect(`/author/preview/${author.id}`)
    } catch (error) {
        res.render('authors/edit',{author,error_msg:'error editing this author try again '})
    }
});

// preview author 
router.get('/preview/:id',async (req,res)=>{
    try {
        let author = await Author.findById(req.params.id);
        let books  = await Book.find({author:req.params.id});
        res.render('authors/preview',{books,author});
    } catch (error) {
        res.redirect("/author")
    }
})


module.exports = router;