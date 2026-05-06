const Post = require("./postModel");
const { AppError } = require("../../middleware/errorHandler");

// Helper to build query
const buildQuery = (queryParams) => {
  const {
    search,
    state,
    sort = "-createdAt",
    page = 1,
    limit = 20,
  } = queryParams;

  let query = {};

  // Search by title, content, tags or author username
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  // State filter
  if (state) {
    query.state = state;
  }

  return { query, sort, page: Number(page), limit: Number(limit) };
};

// Create Post (Draft)
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: "Post created as draft",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Published Posts (Public, Search, Sort, Paginated)
const getPublishedPosts = async (req, res, next) => {
  try {
    const { query, sort, page, limit } = buildQuery(req.query);
    query.state = "published";

    const posts = await Post.find(query)
      .populate("author", "first_name last_name username avatar")
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Published Post
const getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      state: "published",
    }).populate("author", "first_name last_name username bio avatar");

    if (!post) {
      return next(new AppError("Post not found or not published yet", 404));
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Posts (with state filter)
const getMyPosts = async (req, res, next) => {
  try {
    const { state, page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const query = { author: req.user._id };
    if (state) query.state = state;

    const posts = await Post.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// Update Post (Owner Only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post)
      return next(new AppError("Post not found or access denied", 404));

    Object.assign(post, req.body);
    await post.save();

    res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Publish Post
const publishPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post)
      return next(new AppError("Post not found or access denied", 404));
    if (post.state === "published") {
      return next(new AppError("Post is already published", 400));
    }

    post.state = "published";
    await post.save();

    res.json({
      success: true,
      message: "Post published successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post)
      return next(new AppError("Post not found or access denied", 404));

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Feed - Published Posts
const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    // Get IDs of users being followed
    const Follow = require("../follows/followModel");
    const following = await Follow.find({ follower: req.user._id }).select(
      "following"
    );
    const followingIds = following.map((f) => f.following);

    // Include own posts + following users' posts
    const query = {
      state: "published",
      author: { $in: [...followingIds, req.user._id] },
    };

    const posts = await Post.find(query)
      .populate("author", "first_name last_name username avatar")
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPublishedPosts,
  getSinglePost,
  getMyPosts,
  updatePost,
  publishPost,
  deletePost,
  getFeed,
};
