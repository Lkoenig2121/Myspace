const express = require("express");
const { activityQueries } = require("../db/database");

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  next();
}

// Friend Updates / News Feed (late 2007 style)
router.get("/", requireAuth, (req, res) => {
  const feed = activityQueries.getFeedForUser.all(
    req.session.userId,
    req.session.userId,
  );

  res.render("feed", {
    currentUser: {
      id: req.session.userId,
      username: req.session.username,
      displayName: req.session.displayName,
    },
    feed,
  });
});

// Post a status / blog post to the feed
router.post("/post", requireAuth, (req, res) => {
  const content = (req.body.content || "").trim();
  if (content) {
    activityQueries.create.run(req.session.userId, "blog_post", content, null);
  }
  res.redirect("/feed");
});

module.exports = router;
