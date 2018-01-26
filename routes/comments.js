var express = require("express"),
    router = express.Router({mergeParams: true}),
    Project = require("../models/project"),
    Comment = require("../models/comment");

// ===================
// COMMENTS ROUTE
// ===================

// NEW - Show form to make a comment
router.get("/new", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err || !foundProject) {
            console.log(err);
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    // Add user to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // And save
                    comment.save();
                    foundProject.comment.push(comment._id);
                    foundProject.save();
                    res.redirect("/projects/" + foundProject._id);
                }
            });
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