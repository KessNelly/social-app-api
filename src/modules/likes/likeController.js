const Like = require("./likeModel");
const Post = require("../posts/postModel");
const { AppError } = require("../../middleware/errorHandler");

// Toggle Like (Like / Unlike)
const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return next(new AppError("Post not found", 404));

    // Check if already liked
    const existingLike = await Like.findOne({
      user: req.user._id,
      post: postId,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      await post.decrementLike();

      return res.json({
        success: true,
        message: "Post unliked",
        like_count: post.like_count,
      });
    } else {
      // Like
      await Like.create({
        user: req.user._id,
        post: postId,
      });
      await post.incrementLike();

      return res.json({
        success: true,
        message: "Post liked",
        like_count: post.like_count,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleLike,
};
