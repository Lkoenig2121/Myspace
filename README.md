# MySpace Clone 🎵

A nostalgic recreation of MySpace with customizable profiles, built with Node.js, Express, and Tailwind CSS!

## Features ✨

- **User Authentication**: Sign up, login, and secure session management
- **Customizable Profiles**: Just like the old days!
  - Add custom HTML to your profile
  - Add custom CSS to style your profile page
  - Set your mood, location, and profile song
- **Top 8 Friends**: The iconic MySpace feature (structure in place)
- **User Discovery**: Browse all users and visit their profiles
- **Beautiful UI**: Modern Tailwind CSS with nostalgic vibes

## Tech Stack 🛠

- **Backend**: Node.js + Express
- **Database**: SQLite (with better-sqlite3)
- **Sessions**: express-session with SQLite store
- **Authentication**: bcryptjs for password hashing
- **Template Engine**: EJS
- **Styling**: Tailwind CSS (via CDN)

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:3000
```

### Demo Login Credentials 🔑

The app comes with pre-seeded demo accounts:

**Primary Demo Account:**

- Username: `demo`
- Password: `password123`

**Tom's Account (Your first friend!):**

- Username: `tom`
- Password: `test123`

These accounts are automatically created when you first start the server. You can also create your own account by clicking "Sign Up"!

## Usage 📖

### First Time Setup

1. Click "Sign Up" to create a new account
2. Fill in your username, email, display name, and password
3. You'll be automatically redirected to edit your profile

### Customizing Your Profile

On the Edit Profile page, you can:

- **Basic Info**: Set your mood, location, bio, and profile song
- **Custom HTML**: Add any HTML content to create custom sections
  - Use `<marquee>` tags for that authentic 2005 feel!
  - Add `<blink>` tags (nostalgic even if they don't work!)
  - Embed images, create tables, add paragraphs
- **Custom CSS**: Style your profile page with custom styles
  - Change background colors and gradients
  - Modify fonts and text colors
  - Add borders, shadows, and more!

### Example Custom HTML

```html
<marquee>Welcome to my page!</marquee>
<h3>My Favorite Things</h3>
<p>Music, coding, and nostalgia!</p>
<img src="https://example.com/image.gif" alt="Cool GIF" />
```

### Example Custom CSS

```css
body {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

.profile-container {
  border: 3px dotted hotpink;
}

h1 {
  font-family: "Comic Sans MS", cursive;
  color: lime;
}
```

## Project Structure 📁

```
myspace/
├── db/
│   ├── database.js          # Database setup and queries
│   └── myspace.db            # SQLite database (auto-generated)
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── home.js               # Homepage routes
│   └── profile.js            # Profile routes
├── views/
│   ├── login.ejs             # Login page
│   ├── signup.ejs            # Signup page
│   ├── home.ejs              # Homepage with user list
│   ├── profile.ejs           # Profile view page
│   └── edit-profile.ejs      # Profile edit page
├── server.js                 # Main Express server
├── package.json              # Dependencies
└── README.md                 # This file
```

## Database Schema 💾

### Users Table

- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- display_name
- created_at

### Profiles Table

- user_id (Primary Key, Foreign Key to users)
- bio
- custom_css
- custom_html
- profile_song
- mood
- location

### Friendships Table (Top 8 Friends)

- id (Primary Key)
- user_id (Foreign Key)
- friend_id (Foreign Key)
- position (1-8 for Top 8)
- created_at

## Security Notes 🔒

- Passwords are hashed using bcryptjs
- Sessions are stored securely in SQLite
- User input in custom HTML is rendered as-is (sanitization recommended for production)

## Future Enhancements 🔮

- Friend requests and management
- Comments on profiles
- Private messaging
- Photo galleries
- Blog posts
- Music player integration
- Themes and pre-made templates

## Deployment 🚀

Want to deploy this to the web? Check out the [DEPLOYMENT.md](DEPLOYMENT.md) guide for instructions on deploying to:
- Render (recommended, free tier available)
- Railway
- Heroku
- Fly.io

The app is production-ready and includes automatic database seeding!

## License

MIT

---

Built with ❤️ and nostalgia for the golden age of social media!
# Myspace
