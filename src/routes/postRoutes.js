const express = require("express");
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
router.get("/published", getPublishedPosts); // Get all published posts

// PROTECTED ROUTES
router.use(protect);

router.post("/", createPost); // Create new post (draft)
router.get("/me", getMyPosts); // Get user's own posts
router.patch("/:id", updatePost); // Update post
router.patch("/:id/publish", publishPost); // Publish a draft
router.delete("/:id", deletePost); // Delete post
router.get("/feed", getFeed);

router.get("/:id", getSinglePost); // Get single published post

module.exports = router;
