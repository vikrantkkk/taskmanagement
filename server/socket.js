let io;

const initializeSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust this as per your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen to the event where the user joins a room
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User with ID ${userId} joined room.`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

const sendNotification = (userId, notification) => {
  if (io) {
    io.to(userId).emit("receiveNotification", notification);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

module.exports = { initializeSocket, sendNotification };
