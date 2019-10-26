const router = require("express").Router();
const Author = require('../models/Author');


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
router.get("/new",(req,res)=>res.render('authors/new'));

// create new author
router.post("/new", async (req,res)=>{
    try {
      await new Author({author : req.body.name}).save();
      res.redirect('/author');  
    } catch (error) {
        res.render("authors/new",{error_msg:error})
    }});

// Delete author
router.delete("/",(req,res)=>{});


// Update author
router.put("/",(req,res)=>{});


module.exports = router;