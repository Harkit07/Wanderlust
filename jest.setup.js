const mongoose = require("mongoose");

beforeAll(async () => {
  const dbUrl =
    process.env.TEST_DB_URL ||
    "mongodb://127.0.0.1:27017/wanderlust_test";

  await mongoose.connect(dbUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
});