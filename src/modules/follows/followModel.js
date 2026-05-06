const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Self-follow validation
followSchema.pre("save", async function () {
  if (this.follower.toString() === this.following.toString()) {
    throw new Error("You cannot follow yourself");
  }
});

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
