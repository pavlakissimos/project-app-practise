var mongoose = require("mongoose");

// SCHEMA SET UP
var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    difficulty: String,
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ],
    author: String
    // author: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     username: String
    // }
});

module.exports = mongoose.model("Project", projectSchema);