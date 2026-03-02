const express = require("express");
const {
  userQueries,
  profileQueries,
  friendQueries,
  activityQueries,
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
      "",
    );
    profile = profileQueries.get.get(user.id);
  }

  const top8 = friendQueries.getTop8.all(user.id);

  const isOwnProfile = req.session.userId === user.id;
  const currentUser = req.session.userId
    ? {
        id: req.session.userId,
        username: req.session.username,
        displayName: req.session.displayName,
      }
    : null;
  const isFriend =
    currentUser && !isOwnProfile
      ? !!friendQueries.isFriend.get(currentUser.id, user.id)
      : false;

  res.render("profile", {
    user,
    profile,
    top8,
    isOwnProfile,
    currentUser,
    isFriend,
  });
});

// Add friend (must be before /:username to avoid "add-friend" as username)
router.post("/:username/add-friend", requireAuth, (req, res) => {
  const profileUser = userQueries.findByUsername.get(req.params.username);
  if (!profileUser) {
    return res.status(404).send("User not found");
  }
  if (profileUser.id === req.session.userId) {
    return res.redirect(`/profile/${req.params.username}`);
  }
  if (friendQueries.isFriend.get(req.session.userId, profileUser.id)) {
    return res.redirect(`/profile/${req.params.username}`);
  }
  const nextRow = friendQueries.getNextTop8Position.get(req.session.userId);
  const nextPos = nextRow && nextRow.next_pos <= 8 ? nextRow.next_pos : null;
  friendQueries.addFriend.run(req.session.userId, profileUser.id, nextPos);
  res.redirect(`/profile/${req.params.username}`);
});

// Remove friend
router.post("/:username/remove-friend", requireAuth, (req, res) => {
  const profileUser = userQueries.findByUsername.get(req.params.username);
  if (!profileUser) {
    return res.status(404).send("User not found");
  }
  friendQueries.removeFriend.run(req.session.userId, profileUser.id);
  res.redirect(`/profile/${req.params.username}`);
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
    location || "",
  );

  activityQueries.create.run(
    req.session.userId,
    "profile_update",
    "updated their profile",
    mood ? JSON.stringify({ mood }) : null,
  );

  res.redirect(`/profile/${req.session.username}`);
});

module.exports = router;
