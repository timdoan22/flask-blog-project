const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        user: req.user.id,
        hasVoted: [],
        userName: req.user.userName
      });
      console.log('test')
      res.redirect("/bookmark/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      const user = req.user.id
      const comment = await Comment.findById(req.params.commentid);
      const hasVotedArr = comment.hasVoted
   
      // Update the like counter by one if the user hasn't voted yet; 
      // otherwise remove their like
      if (hasVotedArr.includes(user)) {
        await Comment.findOneAndUpdate(
          { _id: req.params.commentid },
          {
            $pull: { hasVoted: user },
            $inc: { likes: -1 },
          }
        )
      } else {
        await Comment.findOneAndUpdate(
          { _id: req.params.commentid },
          {
            $push: { hasVoted: user },
            $inc: { likes: 1 },
          }
        );
      }
      console.log("Comment likes +1");
      // return the user to the same post page
      res.redirect("/bookmark/"+req.params.postid);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Delete comment from db
      await Comment.deleteOne({ _id: req.params.commentid });
      console.log("Deleted Comment");
      res.redirect("/bookmark/"+req.params.postid);
    } catch (err) {
      res.redirect("/bookmark/"+req.params.postid);
    }
  },
}