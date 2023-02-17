const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: String,
    launch_date: Date,
    summary: String,
    pegi_rate: Number,
    duration: Number,
  }
);

module.exports = mongoose.model("game", schema);
