var express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");

// App configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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

// Create Route - Create a new blog post
app.post("/blogs", function(request, response) {
  Blog.create(request.body.blog, function(error, createdBlog){
    if(error)
      console.log("An error has occured " + error);
    else
      response.redirect("/blogs");
  });
});

// Show Route - Displays detailed information about a specific blog
app.get("/blogs/:id", function(request, response) {
  Blog.findById(request.params.id, function (error, foundBlog){
    if(error)
      console.log("An error has occured: " + error);
    else
      response.render("show", {blog: foundBlog});
    });  
});

// Edit Route - Allows us to editing exisiting blog posts
app.get("/blogs/:id/edit", function(request, response){
  Blog.findById(request.params.id, function (error, foundBlog){
    if(error)
      console.log("An error has occured: " + error);
    else
      response.render("edit", {blog: foundBlog});
    });  
});

// Update Route - Update a blog using information from the edit page
app.put("/blogs/:id", function(request, response){
  Blog.findByIdAndUpdate(request.params.id, request.body.blog, function(error, updatedBlog){
    if(error)
      console.log("An error has occured: " + error);
    else
      response.redirect("/blogs/" + request.params.id);
  });
});

app.listen("3000", function(){ 
  console.log("Blog is listening on port 3000");
});