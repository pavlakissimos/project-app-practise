var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    session        = require("express-session"),
    passport       = require("passport"),
    methodOverride = require("method-override"),
    Project        = require("./models/project"),
    LocalStrategy  = require("passport-local");

mongoose.connect("mongodb://localhost/project_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// =================
//      ROUTES
// =================

// HOME - Landing page
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - Show all the projects
app.get("/projects", function(req, res){
    // Get All Projetcs from DB
    Project.find({}, function(err, allProjects){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {projects: allProjects});
        }
    });
});

// CREATE - Add a new project to the DB
app.post("/projects", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = req.body.author;
    var newProject = {name: name, image: image, description: description, author: author};
    // Create new project and save on the db
    Project.create(newProject, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // redirect
            res.redirect("/projects");
        }
    });
});

// NEW - Show form to make a new project
app.get("/projects/new", function(req, res) {
    res.render("project/new");
});

// SHOW - Show info about a project
app.get("/projects/:id", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject){
        if (err || !foundProject) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("project/show", {project: foundProject});
        }
    });
});

// Tell express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});