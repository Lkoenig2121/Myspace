const express = require("express");
const { userQueries } = require("../db/database");

const router = express.Router();

// Homepage
router.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }

  const users = userQueries.getAll.all();

  res.render("home", {
    currentUser: {
      id: req.session.userId,
      username: req.session.username,
      displayName: req.session.displayName,
    },
    users,
  });
});

module.exports = router;
