const express = require("express");
const Post = require("./models/Post");
const router = express.Router();

// POST
router.post("/games", async (req, res) => {
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

// GET game
router.get("/games/:title", async (req, res) => {
  const post = await Post.findOne({ name: req.params.title });
  console.log(`Game requested: ${req.params.title}`);
  if (post != null) {
    res.send(post);
  } else {
    const title = req.params.title.replace(/\s+/g, '').toLowerCase();
    const regex = new RegExp(title + '.*', 'i');
    const partialMatch = await Post.findOne({ name_simplified: { $regex: regex }});
    if (partialMatch != null) {
      res.send(partialMatch);
    } else {
      res.status(404);
      res.send({ error: "Post doesn't exist!" });
    }
  }
});


// GET all game titles
router.get("/games", async (req, res) => {
  const titles = await Post.find({}, { _id: 0, name: 1 });
  if (titles.length > 0) {
    res.send(titles);
  } else {
    res.status(404);
    res.send({ error: "No game titles found!" });
  }
});


// PATCH
router.patch("/games/:title", async (req, res) => {
  const post = await Post.findOne({ title: req.params.title });

  if (post != null) {
    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.launch_date) {
      post.launch_date = req.body.launch_date;
    }

    if (req.body.summary) {
      post.summary = req.body.summary;
    }

    if (req.body.pegi_rate) {
      post.pegi_rate = req.body.pegi_rate;
    }

    if (req.body.duration) {
      post.duration = req.body.duration;
    }

    await post.save();
    res.send(post);
  } else {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

// DELETE
router.delete("/games/:title", async (req, res) => {
	try {
		await Post.deleteOne({ title: req.params.title })
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

module.exports = router;
