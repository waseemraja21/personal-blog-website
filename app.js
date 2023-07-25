// Import required modules
const express = require("express"); // Express.js for creating web server
const bodyParser = require("body-parser"); // Middleware to parse request bodies
const ejs = require("ejs"); // Templating engine for rendering views
const mongoose = require('mongoose'); // MongoDB object data modeling library

// Content for different sections of the website
const homeStartingContent = "Dear readers, thank you for stopping by and joining me on this exciting journey through my thoughts, experiences, and adventures. This blog is a space where I intend to share my passions, insights, and the little nuggets of wisdom I've picked up along the way."; // Content for the home page
const aboutContent = "The information provided on this personal blog website is for general informational purposes only. The content is based on the author's experiences, opinions, and research up to the date of publication, and it may not be entirely up-to-date or accurate in the future."; // Content for the about page
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."; // Content for the contact page

// Create an instance of the Express application
const app = express();

// Set the view engine to use EJS for rendering templates
app.set('view engine', 'ejs');

// Use body-parser middleware to parse request bodies in the URL-encoded format
app.use(bodyParser.urlencoded({extended: true}));

// Serve static assets (e.g., CSS, images) from the "public" directory
app.use(express.static("public"));

// Connect to the MongoDB database named "blogDB"
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

// Define the schema for a blog post
const postSchema = {
  title: String,
  content: String
};

// Create a model based on the post schema
const Post = mongoose.model("Post", postSchema);

// Route: Home Page
app.get("/", function(req, res){
  // Fetch all posts from the database and render the "home" view
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts // Pass the fetched posts to the view
    });
  });
});

// Route: Compose Page (GET request)
app.get("/compose", function(req, res){
  // Render the "compose" view, where users can create a new post
  res.render("compose");
});

// Route: Compose Page (POST request)
app.post("/compose", function(req, res){
  // Create a new post based on user input from the "compose" form
  const post = new Post({
    title: req.body.postTitle, // Get the post title from the request body
    content: req.body.postBody // Get the post content from the request body
  });

  // Save the newly created post to the database
  post.save(function(err){
    if (!err){
      // If the post is saved successfully, redirect back to the home page
      res.redirect("/");
    }
  });
});

// Route: Individual Post Page
app.get("/posts/:postId", function(req, res){
  // Get the requested post ID from the URL parameter
  const requestedPostId = req.params.postId;

  // Find the post with the given ID in the database and render the "post" view
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title, // Pass the post title to the view
      content: post.content // Pass the post content to the view
    });
  });
});

// Route: About Page
app.get("/about", function(req, res){
  // Render the "about" view with the aboutContent
  res.render("about", {aboutContent: aboutContent});
});

// Route: Contact Page
app.get("/contact", function(req, res){
  // Render the "contact" view with the contactContent
  res.render("contact", {contactContent: contactContent});
});

// Start the server and listen on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
