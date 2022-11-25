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

const HocusChallengeSchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    clue: {
      type: String,
      required: true,
    },
    credit: {
      type: String,
    },
    creditUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    hitAreas: [
      {
        x1: {
          type: Number,
        },
        y1: {
          type: Number,
        },
        x2: {
          type: Number,
        },
        y2: {
          type: Number,
        },
        w: {
          type: Number,
        },
      },
    ],
    goals: {
      type: [Number],
    },
    beforeTitle: {
      type: String,
    },
    beforeMessage: {
      type: String,
    },
    isTest: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
const HocusChallenge = mongoose.model("HocusChallenge", HocusChallengeSchema);

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
  HocusChallenge,
  HocusSolve,
  HocusFeedback,
  FiveMinuteClick,
  FiveMinuteAdd,
  PageView,
};
