const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const bookmarksController = require("../controllers/bookmarks");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, bookmarksController.getBookmark);

// post route to create post and requiring multer middleware to handle upload
router.post("/createBookmark", upload.single("file"), bookmarksController.createBookmark);

router.put("/likeBookmark/:id", bookmarksController.likeBookmark);

router.put("/favouriteBookmark/:id", bookmarksController.favouriteBookmark);

router.delete("/deleteBookmark/:id", bookmarksController.deleteBookmark);

module.exports = router;