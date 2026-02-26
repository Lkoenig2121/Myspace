const bcrypt = require("bcryptjs");
const { userQueries, profileQueries, friendQueries } = require("./database");
         
// Data for generating 98 additional users (demo + tom = 2, so 98 more = 100 total)
const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn",
  "Skyler", "Jamie", "Dakota", "Reese", "Parker", "Blair", "Cameron", "Drew",
  "Ashley", "Brittany", "Chad", "Tiffany", "Jessica", "Mike", "Sarah", "Chris",
  "Katie", "Nick", "Emily", "Matt", "Lauren", "Justin", "Amanda", "Brandon",
  "Stephanie", "Ryan", "Megan", "Josh", "Rachel", "Andrew", "Samantha", "Daniel",
  "Nicole", "Kevin", "Heather", "Jason", "Jennifer", "Eric", "Lisa", "Brian",
  "Michelle", "Adam", "Melissa", "Nathan", "Angela", "Travis", "Christina",
  "Kyle", "Rebecca", "Marcus", "Laura", "Derek", "Kimberly", "Corey", "Amy",
  "Zach", "Lindsey", "Tyler", "Brittney", "Cody", "Hannah", "Jake", "Olivia",
  "Dylan", "Emma", "Logan", "Grace", "Hunter", "Chloe", "Blake", "Lily",
  "Cole", "Zoey", "Hayden", "Natalie", "Peyton", "Victoria", "Sage", "Brooklyn",
];

const LOCATIONS = [
  "Los Angeles, CA", "New York, NY", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX",
  "San Jose, CA", "Austin, TX", "Jacksonville, FL", "Columbus, OH", "Charlotte, NC",
  "Seattle, WA", "Denver, CO", "Boston, MA", "Nashville, TN", "Portland, OR",
  "Las Vegas, NV", "Miami, FL", "Atlanta, GA", "Minneapolis, MN", "Orlando, FL",
  "The Internet", "MySpace HQ", "Cleveland, OH", "Tampa, FL", "Detroit, MI",
  "Brooklyn, NY", "San Francisco, CA", "Austin, TX", "Seattle, WA", "Denver, CO",
];

const MOODS = [
  "chillin", "excited", "nostalgic", "friendly", "happy", "bored", "creative",
  "tired", "hopeful", "silly", "curious", "relaxed", "pumped", "chill",
  "blessed", "grateful", "vibing", "living my best life", "missing 2005",
  "listening to music", "coding", "scrolling", "online", "away",
];

const BIOS = [
  "Hey! Thanks for visiting my MySpace! Add me if you want 😎",
  "Just here for the vibes. Music and friends!",
  "Don't hate the player, hate the game. JK love you all!",
  "Living my best life in 2005. Profile song slaps.",
  "Thanks for the add! Leave me a comment sometime.",
  "Music is life. So is MySpace. No cap.",
  "Here to make friends and customize my profile. That's it.",
  "If you're reading this, you're awesome. Thanks for stopping by!",
  "Just a regular person with an irregular love for the internet.",
  "MySpace > everything. Don't @ me.",
  "Profile under construction but my heart is ready for friends!",
  "Add me, comment, let's be friends. The old school way.",
  "Keeping it real since I made this account.",
  "Welcome to my corner of the internet. Stay awhile!",
  "Music, friends, and custom HTML. What more do you need?",
  "Thanks for checking out my page. You're cool in my book!",
  "Living that MySpace life. Profile song on repeat.",
  "Here for the nostalgia and the friends. Hit me up!",
  "Just trying to make my profile as cool as yours.",
  "Welcome! Feel free to look around. No touchy the custom CSS though 😂",
];

async function seedDatabase() {
  try {
    // Check if we already have enough users
    const allUsers = userQueries.getAll.all();
    if (allUsers.length >= 100) {
      console.log("Database already has 100+ users. Skipping seed.");
      return;
    }

    const defaultHashedPassword = await bcrypt.hash("password123", 10);

    // 1. Demo user (only if not exists)
    let demoUserId = (userQueries.findByUsername.get("demo") || {}).id;
    if (!demoUserId) {
      const demoUser = userQueries.create.run(
        "demo",
        "demo@myspace.com",
        defaultHashedPassword,
        "Demo User",
      );
      demoUserId = demoUser.lastInsertRowid;
    }

    // Demo profile
    profileQueries.upsert.run(
      demoUserId,
      "Welcome to my MySpace! 🎵\n\nI'm the demo user - feel free to explore my profile and see how customization works!",
      `body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-container {
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
      `<center>
  <marquee behavior="scroll" direction="left" scrollamount="5">
    ✨ Welcome to my totally awesome MySpace page! ✨
  </marquee>
</center>

<h3 style="color: #667eea; font-family: 'Comic Sans MS', cursive;">About Me 💫</h3>
<p>I love web development, nostalgia, and bringing back the golden age of the internet!</p>

<h3 style="color: #764ba2; font-family: 'Comic Sans MS', cursive;">My Interests 🎨</h3>
<ul>
  <li>Coding</li>
  <li>Music</li>
  <li>Early 2000s internet culture</li>
  <li>Custom CSS and HTML</li>
</ul>`,
      "Darude - Sandstorm",
      "nostalgic",
      "The Internet, 2005",
    );

    // 2. Tom (only if not exists)
    let tomUserId = (userQueries.findByUsername.get("tom") || {}).id;
    if (!tomUserId) {
      const hashedTest = await bcrypt.hash("test123", 10);
      const testUser = userQueries.create.run(
        "tom",
        "tom@myspace.com",
        hashedTest,
        "Tom from MySpace",
      );
      tomUserId = testUser.lastInsertRowid;
      profileQueries.upsert.run(
        tomUserId,
        "Hey! Thanks for being my friend! I'm Tom, your first friend on MySpace!",
        "",
        "<center><h2>Thanks for the add!</h2></center>",
        "",
        "friendly",
        "MySpace HQ",
      );
      try {
        friendQueries.addFriend.run(demoUserId, tomUserId, 1);
      } catch (e) {
        if (!e.message || !e.message.includes("UNIQUE")) throw e;
      }
    }

    // 3–100: Create 98 more users (user3, user4, ... user100)
    for (let i = 3; i <= 100; i++) {
      const username = `user${i}`;
      const email = `user${i}@myspace.com`;
      const nameIndex = (i - 3) % FIRST_NAMES.length;
      const displayName = FIRST_NAMES[nameIndex];

      const bio = BIOS[Math.floor(Math.random() * BIOS.length)];
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

      try {
        const result = userQueries.create.run(
          username,
          email,
          defaultHashedPassword,
          displayName,
        );
        profileQueries.create.run(result.lastInsertRowid, bio, location);
      } catch (err) {
        if (err.message && err.message.includes("UNIQUE")) {
          // User already exists (e.g. from previous partial seed), skip
        } else {
          throw err;
        }
      }
    }

    console.log("✅ Database seeded with 100 users!");
    console.log("\n📝 Demo Credentials:");
    console.log("   Username: demo");
    console.log("   Password: password123");
    console.log("\n📝 Alternative Account:");
    console.log("   Username: tom");
    console.log("   Password: test123");
    console.log("\n   (Users 3–100 can log in with password: password123)");
    console.log("");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
