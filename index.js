if (process.env.NODE !== "production") {
    require("dotenv").config()
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const layouts = require("express-ejs-layouts");
const IndexRouter = require("./routes/index");
const AuthorRouter = require("./routes/authers");
const BookRouter = require("./routes/books");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(bodyParser.urlencoded({limit:'10mb',extended:false}));
app.use(express.static("public"));
app.use(layouts);
app.use("/", IndexRouter);
app.use("/author", AuthorRouter);
app.use("/book", BookRouter);


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connection.on("error", error => console.error(error));
mongoose.connection.once("open", () => console.log("mongo connect success"));
app.listen(process.env.PORT || 5000, () =>
  console.log("server is running on port 5000")
);

