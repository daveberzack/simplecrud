const mongoose = require("mongoose");

const PageViewSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    touch: {
      type: Boolean,
    },
    user: {
      type: String,
    },
  },
  { timestamps: true }
);
const PageView = mongoose.model("PageView", PageViewSchema);

const HocusSolveSchema = new mongoose.Schema(
  {
    tester: {
      type: String,
    },
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
    tester: {
      type: String,
      required: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    fun: {
      type: Number,
    },
    difficulty: {
      type: Number,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);
const HocusFeedback = mongoose.model("HocusFeedback", HocusFeedbackSchema);

const FiveMinuteClickSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);
const FiveMinuteClick = mongoose.model("FiveMinuteClick", FiveMinuteClickSchema);

const FiveMinuteAddSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
const FiveMinuteAdd = mongoose.model("FiveMinuteAdd", FiveMinuteAddSchema);

module.exports = {
  HocusSolve,
  HocusFeedback,
  FiveMinuteClick,
  FiveMinuteAdd,
  PageView,
};
