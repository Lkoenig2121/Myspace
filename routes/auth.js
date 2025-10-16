const express = require("express");
const bcrypt = require("bcryptjs");
const { userQueries, profileQueries } = require("../db/database");

const router = express.Router();

// Show login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = userQueries.findByUsername.get(username);

    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.render("login", { error: "Invalid username or password" });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.displayName = user.display_name;

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { error: "An error occurred during login" });
  }
});

// Show signup page
router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// Handle signup
router.post("/signup", async (req, res) => {
  const { username, email, password, displayName } = req.body;

  try {
    // Check if user exists
    const existingUser = userQueries.findByUsername.get(username);
    if (existingUser) {
      return res.render("signup", { error: "Username already taken" });
    }

    const existingEmail = userQueries.findByEmail.get(email);
    if (existingEmail) {
      return res.render("signup", { error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = userQueries.create.run(
      username,
      email,
      hashedPassword,
      displayName
    );
    const userId = result.lastInsertRowid;

    // Create default profile
    profileQueries.create.run(
      userId,
      "Hey! Thanks for visiting my MySpace!",
      ""
    );

    // Log them in
    req.session.userId = userId;
    req.session.username = username;
    req.session.displayName = displayName;

    res.redirect("/profile/edit");
  } catch (error) {
    console.error("Signup error:", error);
    res.render("signup", { error: "An error occurred during signup" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
