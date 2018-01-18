var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    session          = require("express-session"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    Project          = require("./models/project"),
    Comment          = require("./models/comment"),
    LocalStrategy    = require("passport-local");

mongoose.connect("mongodb://localhost/project_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

// =================
//      ROUTES
// =================

// =====================
// PROJECTS ROUTES
// =====================

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
    Project.findById(req.params.id).populate("comment").exec(function(err, foundProject){
        if (err || !foundProject) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("project/show", {project: foundProject});
        }
    });
});

// EDIT - Edit an existing project
app.get("/projects/:id/edit", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err || !foundProject) {
            res.redirect("back");
        } else {
            res.render("project/edit", {project: foundProject});
        }
    });
});

// UPDATE - Update the selected project
app.put("/projects/:id", function(req, res){
    req.body.project.body = req.sanitize(req.body.project.body);
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updated){
        if (err || !updated) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/projects/" + req.params.id);
        }
    });
});

// ===================
// COMMENTS ROUTE
// ===================

// NEW - Show form to make a comment
app.get("/projects/:id/comment/new", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject){
        if (err || !foundProject) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comment/new", {project: foundProject});
        }
    });
});

// CREATE - Create new comment on the DB
app.post("/projects/:id/comment", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err || !foundProject) {
            console.log(err);
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    foundProject.comment.push(comment._id);
                    foundProject.save();
                    res.redirect("/projects/" + foundProject._id);
                }
            });
        }
    });
});

// Tell express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});