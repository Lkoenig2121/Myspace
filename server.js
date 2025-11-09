const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const SQLiteStore = require("connect-sqlite3")(session);

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const homeRoutes = require("./routes/home");
const { seedDatabase } = require("./db/seed");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Session configuration
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db" }),
    secret: "myspace-secret-key-2005",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`🎵 MySpace is running on http://localhost:${PORT}`);
  console.log(`   Time to customize your profile like it's 2005!`);
  console.log("");

  // Seed database with demo user
  await seedDatabase();
});
