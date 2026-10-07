require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);

  console.log("connected to DB");

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1);
});