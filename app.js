var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    expressSession   = require("express-session"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    User             = require("./models/user"),
    LocalStrategy    = require("passport-local");
    
var indexRoutes = require("./routes/index"),
    projectRoutes = require("./routes/projects"),
    commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/project_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "Fly you fools!!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==============
// REQUIRE ROUTES
// ==============

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comment", commentRoutes);

// Tell express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});