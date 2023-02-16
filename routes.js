const express = require("express");
const Post = require("./models/Post");
const router = express.Router();

// Get all posts
router.post("/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    launch_date: req.body.launch_date,
    summary: req.body.summary,
    pegi_rate: req.body.pegi_rate,
    duration: req.body.duration,
  });
  await post.save();
  res.send(post);
});

module.exports = router;
