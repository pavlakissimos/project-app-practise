var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User     = require("../models/user")

// HOME - Landing page
router.get("/", function(req, res){
    res.render("landing");
});

// ==============
// AUTH ROUTES
// ==============

// Register Route
router.get("/register", function(req, res) {
    res.render("register");
});

// Handling Register Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err || !user) {
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/projects");
            });
        }
    });
});

// Login Route
router.get("/login", function(req, res) {
    res.render("login");
});

// Handling Login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login"
}), function(req, res){
});

// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/projects");
});

module.exports = router;