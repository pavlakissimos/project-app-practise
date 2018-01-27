var express = require("express"),
    router  = express.Router(),
    Project = require("../models/project"),
    expressSanitizer = require("express-sanitizer");
    
router.use(expressSanitizer());

// ==================
// PROJECTS ROUTES
// ==================

// INDEX - Show all the projects
router.get("/", function(req, res){
    // Get All Projetcs from DB
    Project.find({}, function(err, allProjects){
        if (err) {
            console.log(err);
        } else {
            res.render("project/index", {projects: allProjects});
        }
    });
});

// CREATE - Add a new project to the DB
router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
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
router.get("/new", isLoggedIn, function(req, res) {
    res.render("project/new");
});

// SHOW - Show info about a project
router.get("/:id", function(req, res) {
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
router.get("/:id/edit", isLoggedIn, function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err || !foundProject) {
            res.redirect("back");
        } else {
            res.render("project/edit", {project: foundProject});
        }
    });
});

// UPDATE - Update the selected project
router.put("/:id", isLoggedIn, function(req, res){
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

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;