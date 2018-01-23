var mongoose      = require("mongoose"),
    LocalStrategy = require("passport-local-mongoose");
    
    // SCHEMA SET UP
var UserSchema = new mongoose.Schema({
    username: String,
    passport: String
});
    
UserSchema.plugin(LocalStrategy);
module.exports = mongoose.model("User", UserSchema);