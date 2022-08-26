const cloudinary = require("../middleware/cloudinary");
const Bookmark = require("../models/Bookmark");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      // retrieve all the posts belonging to the user
      const bookmarks = await Bookmark.find({ user: req.user.id });
      // render to profile.ejs and pass in the post and user data
      res.render("profile.ejs", { bookmarks: bookmarks, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      // retieve all the posts in the db
      const bookmarks = await Bookmark.find().sort({ createdAt: "desc" }).lean();
      const users = await User.find();
      // render the template and pass in the all posts data
      res.render("feed.ejs", { bookmarks: bookmarks, user: req.user, users: users });
      console.log(users)
    } catch (err) {
      console.log(err);
    }
  },
  getBookmark: async (req, res) => {
    try {
      // retrieve specific post in db based on the post id
      const bookmark = await Bookmark.findById(req.params.id);
      // retrieve comments tied to the specific post
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();

      // const userName = await User.findById(req.params.id);
      // render template and pass in the specific post data and user data
      res.render("post.ejs", { bookmark: bookmark, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  getNewPost: async (req, res) => {
    try {
      res.render("new_post.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBookmark: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      
      await Bookmark.create({
        title: req.body.title,
        link: req.body.link,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        hasVoted: [],
        likes: 0,
        user: req.user.id,
        userName: req.user.userName,
      });
      console.log("Bookmark has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likeBookmark: async (req, res) => {
    try {
      const user = req.user.id
      const bookmark = await Bookmark.findById(req.params.id);
      const hasVotedArr = bookmark.hasVoted
  
      // Update the like counter by one if the user hasn't voted yet; 
      // otherwise remove their like
      if (hasVotedArr.includes(user)) {
        await Bookmark.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { hasVoted: user },
            $inc: { likes: -1 },
          }
        );
      } else {
        await Bookmark.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: { hasVoted: user },
            $inc: { likes: 1 },
          }
        );
      }
      // return the user to the same post page
      // res.redirect(`/bookmark/${req.params.id}`);
      res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  favouriteBookmark: async (req, res) => {
    try {
      const user = req.user.id
      const bookmark = await Bookmark.findById(req.params.id);
      const usersFavouritesArr = bookmark.usersFavourites
 
      // Update the like counter by one if the user hasn't voted yet; 
      // otherwise remove their like
      if (usersFavouritesArr.includes(user)) {
        await Bookmark.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { usersFavourites: user },
          }
        );
      } else {
        await Bookmark.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: { usersFavourites: user },
          }
        );
      }
      // return the user to the same post page
      // res.redirect(`/bookmark/${req.params.id}`);
      res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  deleteBookmark: async (req, res) => {
    try {
      // Find the specific post by id
      let bookmark = await Bookmark.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(bookmark.cloudinaryId);
      // Delete post from db
      await Bookmark.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};