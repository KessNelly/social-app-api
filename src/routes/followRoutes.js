const express = require("express");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require("../modules/follows/followController");

const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All follow routes require authentication

router.post("/:userId/follow", followUser);
router.delete("/:userId/unfollow", unfollowUser);

router.get("/following", getFollowing);
router.get("/followers", getFollowers);

module.exports = router;
