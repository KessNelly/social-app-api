const express = require("express");
const { toggleLike } = require("../modules/likes/likeController");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/:postId/toggle", toggleLike);

module.exports = router;
