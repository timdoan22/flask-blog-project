const mongoose = require("mongoose");

// Post schema 
const BookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  hasVoted: {
    type: Array,
  },
  usersFavourites: {
    type: Array,
  },
  likes: {
    type: Number,
    required: true,
  },
  // grab the user's id by referencing the user schema
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);
