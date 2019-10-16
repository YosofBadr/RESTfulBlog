var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");

// App configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Configuration
mongoose.connect("mongodb://localhost:27017/restfulblog", { useNewUrlParser: true, useUnifiedTopology: true }); 

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes

// Root Route - Redirects to index route
app.get("/", function(request, response){
  response.redirect("/blogs");
});

// Index Route - Displays all blogs
app.get("/blogs", function(request, response){
  Blog.find({}, function(error, blogs){
    if(error)
      console.log("Error has occured: " + error);
    else
      response.render("index", {blogs: blogs});
  });
});

// New Route - Displays a form to create a new blog
app.get("/blogs/new", function(request, response){
  response.render("new");
});

app.listen("3000", function(){ 
  console.log("Blog is listening on port 3000");
});