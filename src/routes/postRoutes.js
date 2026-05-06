const express = require("express");
const pagination = require("../middleware/pagination");
const {
  createPost,
  getPublishedPosts,
  getSinglePost,
  getMyPosts,
  updatePost,
  publishPost,
  deletePost,
  getFeed,
} = require("../modules/posts/postController");

const protect = require("../middleware/auth");

const router = express.Router();

// PUBLIC ROUTES
router.get("/published", pagination(20, 100), getPublishedPosts); // Get all published posts

// PROTECTED ROUTES
router.use(protect);

router.post("/", createPost); // Create new post (draft)
router.get("/me", pagination(20, 100), getMyPosts); // Get user's own posts
router.get("/feed", pagination(20, 100), getFeed); // Feed

router.patch("/:id", updatePost); // Update post
router.patch("/:id/publish", publishPost); // Publish a draft
router.delete("/:id", deletePost); // Delete post
router.get("/:id", getSinglePost); // Get single published post

module.exports = router;
