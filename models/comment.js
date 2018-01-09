var mongoose = require("mongoose");

// Comment Schema Set Up
var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comment", commentSchema);