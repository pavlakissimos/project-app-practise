var     express = require("express"),
     bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// =================
//      ROUTES
// =================

// HOME - Landing page
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - Show all the projects
app.get("/projects", function(req, res){
    res.render("index");
});

// Tell express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});