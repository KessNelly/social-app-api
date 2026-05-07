const mongoose = require("mongoose");

beforeAll(async () => {
  const testURI = process.env.MONGO_URI + "-test";
  await mongoose.connect(testURI);
  console.log("Test Database Connected");
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
  console.log("Test database closed");
});
