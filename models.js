const mongoose = require("mongoose");

const HocusSolveSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
    },
    timePassed: {
      type: Number,
      required: true,
    },
    mistakes: {
      type: Number,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const HocusSolve = mongoose.model("HocusSolve", HocusSolveSchema);

const HocusFeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    isFair: {
      type: Boolean,
      required: true,
    },
    isFun: {
      type: Boolean,
      required: true,
    },
    shouldPublish: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const HocusFeedback = mongoose.model("HocusFeedback", HocusFeedbackSchema);

module.exports = { HocusSolve, HocusFeedback };
