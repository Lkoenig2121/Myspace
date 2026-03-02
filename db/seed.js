const bcrypt = require("bcryptjs");
const {
  db,
  userQueries,
  profileQueries,
  friendQueries,
  activityQueries,
} = require("./database");

// Data for generating 98 additional users (demo + tom = 2, so 98 more = 100 total)
const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Skyler",
  "Jamie",
  "Dakota",
  "Reese",
  "Parker",
  "Blair",
  "Cameron",
  "Drew",
  "Ashley",
  "Brittany",
  "Chad",
  "Tiffany",
  "Jessica",
  "Mike",
  "Sarah",
  "Chris",
  "Katie",
  "Nick",
  "Emily",
  "Matt",
  "Lauren",
  "Justin",
  "Amanda",
  "Brandon",
  "Stephanie",
  "Ryan",
  "Megan",
  "Josh",
  "Rachel",
  "Andrew",
  "Samantha",
  "Daniel",
  "Nicole",
  "Kevin",
  "Heather",
  "Jason",
  "Jennifer",
  "Eric",
  "Lisa",
  "Brian",
  "Michelle",
  "Adam",
  "Melissa",
  "Nathan",
  "Angela",
  "Travis",
  "Christina",
  "Kyle",
  "Rebecca",
  "Marcus",
  "Laura",
  "Derek",
  "Kimberly",
  "Corey",
  "Amy",
  "Zach",
  "Lindsey",
  "Tyler",
  "Brittney",
  "Cody",
  "Hannah",
  "Jake",
  "Olivia",
  "Dylan",
  "Emma",
  "Logan",
  "Grace",
  "Hunter",
  "Chloe",
  "Blake",
  "Lily",
  "Cole",
  "Zoey",
  "Hayden",
  "Natalie",
  "Peyton",
  "Victoria",
  "Sage",
  "Brooklyn",
];

const LOCATIONS = [
  "Los Angeles, CA",
  "New York, NY",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Columbus, OH",
  "Charlotte, NC",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
  "Nashville, TN",
  "Portland, OR",
  "Las Vegas, NV",
  "Miami, FL",
  "Atlanta, GA",
  "Minneapolis, MN",
  "Orlando, FL",
  "The Internet",
  "MySpace HQ",
  "Cleveland, OH",
  "Tampa, FL",
  "Detroit, MI",
  "Brooklyn, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Seattle, WA",
  "Denver, CO",
];

const MOODS = [
  "chillin",
  "excited",
  "nostalgic",
  "friendly",
  "happy",
  "bored",
  "creative",
  "tired",
  "hopeful",
  "silly",
  "curious",
  "relaxed",
  "pumped",
  "chill",
  "blessed",
  "grateful",
  "vibing",
  "living my best life",
  "missing 2005",
  "listening to music",
  "coding",
  "scrolling",
  "online",
  "away",
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
    const allUsers = userQueries.getAll.all();
    const skipUserCreation = allUsers.length >= 100;
    if (skipUserCreation) {
      console.log("Database already has 100+ users. Skipping user creation.");
    }

    const defaultHashedPassword = skipUserCreation
      ? null
      : await bcrypt.hash("password123", 10);

    // 1. Demo user (only if not exists)
    let demoUserId = (userQueries.findByUsername.get("demo") || {}).id;
    if (!skipUserCreation && !demoUserId) {
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
    if (!skipUserCreation && !tomUserId) {
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
    if (!skipUserCreation) {
      for (let i = 3; i <= 100; i++) {
        const username = `user${i}`;
        const email = `user${i}@myspace.com`;
        const nameIndex = (i - 3) % FIRST_NAMES.length;
        const displayName = FIRST_NAMES[nameIndex];

        const bio = BIOS[Math.floor(Math.random() * BIOS.length)];
        const location =
          LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

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
    }

    // Friend Updates feed: seed sample activities (runs even if user creation was skipped) for demo and tom (so feed has multiple posts)
    const demoId = (userQueries.findByUsername.get("demo") || {}).id;
    const tomId = (userQueries.findByUsername.get("tom") || {}).id;
    const existingActivities = db
      .prepare("SELECT COUNT(*) AS n FROM activities")
      .get();
    if (existingActivities.n < 15 && demoId && tomId) {
      const samplePosts = [
        {
          userId: demoId,
          type: "blog_post",
          content:
            "Just set up my MySpace again. Who else is still out there? 🎵",
        },
        {
          userId: tomId,
          type: "profile_update",
          content: "updated their profile",
          extra: JSON.stringify({ mood: "friendly" }),
        },
        {
          userId: demoId,
          type: "blog_post",
          content: "Profile song: Darude - Sandstorm. No regrets.",
        },
        {
          userId: tomId,
          type: "blog_post",
          content: "Thanks for being my friend! Hit me up anytime.",
        },
        {
          userId: demoId,
          type: "blog_post",
          content: "Custom HTML section is finally done. Peak 2007 energy.",
        },
        {
          userId: demoId,
          type: "profile_update",
          content: "updated their profile",
          extra: JSON.stringify({ mood: "nostalgic" }),
        },
        {
          userId: tomId,
          type: "blog_post",
          content: "MySpace HQ checking in. Add me if we're not friends yet!",
        },
        {
          userId: demoId,
          type: "blog_post",
          content:
            "If you're reading this, leave a comment on my profile. Old school style.",
        },
        {
          userId: tomId,
          type: "profile_update",
          content: "updated their profile",
          extra: null,
        },
        {
          userId: demoId,
          type: "blog_post",
          content:
            "Discover People page is legit. Go add some friends and check the Friend Updates feed!",
        },
      ];
      for (const row of samplePosts) {
        activityQueries.create.run(
          row.userId,
          row.type,
          row.content,
          row.extra,
        );
      }
      console.log("✅ Seeded Friend Updates with sample posts.");
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
