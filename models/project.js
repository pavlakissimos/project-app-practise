var mongoose = require("mongoose");

// SCHEMA SET UP
var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    difficulty: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    username: String
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("Project", projectSchema);