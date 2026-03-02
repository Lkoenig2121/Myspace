const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "myspace.db"));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    custom_css TEXT,
    custom_html TEXT,
    profile_song TEXT,
    mood TEXT DEFAULT 'chillin',
    location TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    position INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, friend_id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    extra TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Helper functions
const userQueries = {
  create: db.prepare(`
    INSERT INTO users (username, email, password, display_name)
    VALUES (?, ?, ?, ?)
  `),

  findByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  findById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),

  getAll: db.prepare(`
    SELECT id, username, display_name, created_at FROM users ORDER BY created_at DESC
  `),
};

const profileQueries = {
  create: db.prepare(`
    INSERT INTO profiles (user_id, bio, location)
    VALUES (?, ?, ?)
  `),

  get: db.prepare(`
    SELECT * FROM profiles WHERE user_id = ?
  `),

  update: db.prepare(`
    UPDATE profiles 
    SET bio = ?, custom_css = ?, custom_html = ?, profile_song = ?, mood = ?, location = ?
    WHERE user_id = ?
  `),

  upsert: db.prepare(`
    INSERT INTO profiles (user_id, bio, custom_css, custom_html, profile_song, mood, location)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      bio = excluded.bio,
      custom_css = excluded.custom_css,
      custom_html = excluded.custom_html,
      profile_song = excluded.profile_song,
      mood = excluded.mood,
      location = excluded.location
  `),
};

const friendQueries = {
  getTop8: db.prepare(`
    SELECT u.id, u.username, u.display_name, f.position
    FROM friendships f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = ? AND f.position IS NOT NULL
    ORDER BY f.position
    LIMIT 8
  `),

  getAllFriends: db.prepare(`
    SELECT u.id, u.username, u.display_name, f.position
    FROM friendships f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = ?
    ORDER BY (f.position IS NULL), f.position ASC, u.display_name ASC
  `),

  isFriend: db.prepare(`
    SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ? LIMIT 1
  `),

  getNextTop8Position: db.prepare(`
    SELECT COALESCE(MAX(position), 0) + 1 AS next_pos
    FROM friendships WHERE user_id = ? AND position IS NOT NULL AND position <= 8
  `),

  addFriend: db.prepare(`
    INSERT INTO friendships (user_id, friend_id, position)
    VALUES (?, ?, ?)
  `),

  removeFriend: db.prepare(`
    DELETE FROM friendships WHERE user_id = ? AND friend_id = ?
  `),

  updatePosition: db.prepare(`
    UPDATE friendships SET position = ? WHERE user_id = ? AND friend_id = ?
  `),
};

const activityQueries = {
  create: db.prepare(`
    INSERT INTO activities (user_id, type, content, extra)
    VALUES (?, ?, ?, ?)
  `),

  getFeedForUser: db.prepare(`
    SELECT a.id, a.user_id, a.type, a.content, a.extra, a.created_at,
           u.username, u.display_name
    FROM activities a
    JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
       OR EXISTS (
         SELECT 1 FROM friendships f
         WHERE f.user_id = ? AND f.friend_id = a.user_id
       )
    ORDER BY a.created_at DESC
    LIMIT 100
  `),
};

module.exports = {
  db,
  userQueries,
  profileQueries,
  friendQueries,
  activityQueries,
};
