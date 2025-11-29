const express = require("express");
const {
  userQueries,
  profileQueries,
  friendQueries,
} = require("../db/database");

const router = express.Router();

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  next();
}

// Edit profile page (MUST come before /:username route)
router.get("/edit", requireAuth, (req, res) => {
  const user = userQueries.findById.get(req.session.userId);
  let profile = profileQueries.get.get(req.session.userId);

  if (!profile) {
    profileQueries.create.run(req.session.userId, "", "");
    profile = profileQueries.get.get(req.session.userId);
  }

  res.render("edit-profile", {
    user,
    profile,
    currentUser: {
      id: req.session.userId,
      username: req.session.username,
      displayName: req.session.displayName,
    },
  });
});

// View profile (MUST come after specific routes like /edit)
router.get("/:username", (req, res) => {
  const user = userQueries.findByUsername.get(req.params.username);

  if (!user) {
    return res.status(404).send("User not found");
  }

  let profile = profileQueries.get.get(user.id);

  // Create default profile if it doesn't exist
  if (!profile) {
    profileQueries.create.run(
      user.id,
      "Hey! Thanks for visiting my MySpace!",
      ""
    );
    profile = profileQueries.get.get(user.id);
  }

  const top8 = friendQueries.getTop8.all(user.id);

  const isOwnProfile = req.session.userId === user.id;

  res.render("profile", {
    user,
    profile,
    top8,
    isOwnProfile,
    currentUser: req.session.userId
      ? {
          id: req.session.userId,
          username: req.session.username,
          displayName: req.session.displayName,
        }
      : null,
  });
});

// Update profile
router.post("/update", requireAuth, (req, res) => {
  const { bio, customCss, customHtml, profileSong, mood, location } = req.body;

  profileQueries.upsert.run(
    req.session.userId,
    bio || "",
    customCss || "",
    customHtml || "",
    profileSong || "",
    mood || "chillin",
    location || ""
  );

  res.redirect(`/profile/${req.session.username}`);
});

module.exports = router;
 