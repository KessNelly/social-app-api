const Follow = require("./followModel");
const User = require("../users/userModel");
const { AppError } = require("../../middleware/errorHandler");

// Follow a user
const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return next(new AppError("You cannot follow yourself", 400));
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return next(new AppError("User to follow not found", 404));
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: userId,
    });

    if (existingFollow) {
      return next(new AppError("You are already following this user", 400));
    }

    await Follow.create({
      follower: req.user._id,
      following: userId,
    });

    res.status(201).json({
      success: true,
      message: `You are now following ${targetUser.username}`,
    });
  } catch (error) {
    next(error);
  }
};

// Unfollow a user
const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const followRecord = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: userId,
    });

    if (!followRecord) {
      return next(new AppError("You are not following this user", 400));
    }

    res.json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get following
const getFollowing = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const follows = await Follow.find({ follower: req.user._id })
      .populate("following", "first_name last_name username bio avatar")
      .sort("-createdAt")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Follow.countDocuments({ follower: req.user._id });

    res.json({
      success: true,
      count: follows.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      following: follows.map((f) => f.following),
    });
  } catch (error) {
    next(error);
  }
};

// Get followers
const getFollowers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const followers = await Follow.find({ following: req.user._id })
      .populate("follower", "first_name last_name username bio avatar")
      .sort("-createdAt")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Follow.countDocuments({ following: req.user._id });

    res.json({
      success: true,
      count: followers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      followers: followers.map((f) => f.follower),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
};
