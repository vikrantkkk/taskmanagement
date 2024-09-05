const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: { type: String, enum: ["admin", "member"], default: "member" }, // Role within the team
    },
  ],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // List of tasks assigned to the team
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
