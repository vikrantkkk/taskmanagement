const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/userModel'); // Adjust path as necessary

let mongoServer;

// Setup in-memory MongoDB server and connection before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

// Cleanup database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close connection and stop in-memory server after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
