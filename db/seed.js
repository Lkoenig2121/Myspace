const bcrypt = require("bcryptjs");
const { userQueries, profileQueries, friendQueries } = require("./database");

async function seedDatabase() {
  try {
    // Check if demo user already exists
    const existingUser = userQueries.findByUsername.get("demo");
    if (existingUser) {
      console.log("Demo user already exists!");
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUser = userQueries.create.run(
      "demo",
      "demo@myspace.com",
      hashedPassword,
      "Demo User"
    );

    // Create demo profile with custom content
    profileQueries.upsert.run(
      demoUser.lastInsertRowid,
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
      "The Internet, 2005"
    );

    // Create another test user
    const hashedPassword2 = await bcrypt.hash("test123", 10);
    const testUser = userQueries.create.run(
      "tom",
      "tom@myspace.com",
      hashedPassword2,
      "Tom from MySpace"
    );

    profileQueries.upsert.run(
      testUser.lastInsertRowid,
      "Hey! Thanks for being my friend! I'm Tom, your first friend on MySpace!",
      "",
      "<center><h2>Thanks for the add!</h2></center>",
      "",
      "friendly",
      "MySpace HQ"
    );

    // Add Tom as demo user's friend
    friendQueries.addFriend.run(
      demoUser.lastInsertRowid,
      testUser.lastInsertRowid,
      1
    );

    console.log("✅ Database seeded successfully!");
    console.log("\n📝 Demo Credentials:");
    console.log("   Username: demo");
    console.log("   Password: password123");
    console.log("\n📝 Alternative Account:");
    console.log("   Username: tom");
    console.log("   Password: test123");
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
