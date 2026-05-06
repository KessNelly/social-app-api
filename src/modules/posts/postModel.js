const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    like_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ author: 1, state: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ like_count: -1 });
postSchema.index({ tags: 1 });

//management of likes
postSchema.methods.incrementLike = async function () {
  this.like_count += 1;
  return this.save();
};

postSchema.methods.decrementLike = async function () {
  this.like_count = Math.max(0, this.like_count - 1);
  return this.save();
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
