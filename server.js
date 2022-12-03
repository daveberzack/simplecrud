const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { HocusChallenge, HocusFeedback, HocusSolve, PageView, FiveMinuteAdd, FiveMinuteClick } = require("./models");
const { formatTablePage, getTodayString } = require("./utils");

const PORT = process.env.PORT || 3020;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://daveberzack:zNDEUMMtWlnmRZYi@cluster0.rddcyey.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.get("/hocussolves", async (request, response) => {
  try {
    const rawData = await HocusSolve.find({});
    const data = rawData.map((d) => {
      const output = { challengeId: d.challengeId, tester: d.tester, timePassed: d.timePassed, mistakes: d.mistakes, score: d.timePassed + d.mistakes * 10 };
      console.log(output);
      return output;
    });
    columns = [
      { label: "Challenge", field: "challengeId" },
      { label: "Tester", field: "tester" },
      { label: "Score", field: "score" },
      { label: "Time", field: "timePassed" },
      { label: "Mistakes", field: "mistakes" },
    ];
    const options = {
      paging: false,
      scrollY: "80%",
      searching: false,
    };
    const html = formatTablePage("Solves", columns, data, options);
    response.send(html);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/hocussolve/:id", async (request, response) => {
  try {
    const filter = { challengeId: request.params.id };
    console.log(filter);
    const rawData = await HocusSolve.find(filter);
    const data = rawData.map((d) => {
      const output = { challengeId: d.challengeId, tester: d.tester, timePassed: d.timePassed, mistakes: d.mistakes, score: d.timePassed + d.mistakes * 10 };
      return output;
    });
    columns = [
      { label: "Challenge", field: "challengeId" },
      { label: "Tester", field: "tester" },
      { label: "Score", field: "score" },
      { label: "Time", field: "timePassed" },
      { label: "Mistakes", field: "mistakes" },
    ];
    const options = {
      paging: false,
      scrollY: "80%",
      searching: false,
    };
    const html = formatTablePage("Solves", columns, data, options);
    response.send(html);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/pageview", async (request, response) => {
  const data = new PageView(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/hocusfeedback", async (request, response) => {
  const data = new HocusFeedback(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/hocussolve", async (request, response) => {
  const data = new HocusSolve(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/hocuschallenge", async (request, response) => {
  const data = new HocusChallenge(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});


app.post("/hocuschristmas", async (request, response) => {
  const bodyData = request.body;
  console.log("XMas Data:",bodyData);
  response.send("1234");

  // const data = new HocusChallenge(request.body);
  // try {
  //   await data.save();
  //   response.send(data);
  // } catch (error) {
  //   response.status(500).send(error);
  // }
});

app.get("/hocustestchallenges/", async (request, response) => {
  try {
    const filter = { isTest: true };
    const data = await HocusChallenge.find(filter);
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/hocustodaychallenge/", async (request, response) => {
  try {
    const filter = { date: getTodayString() };
    console.log(filter);
    const data = await HocusChallenge.findOne(filter);
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/hocuschallenge/:id", async (request, response) => {
  try {
    const filter = { _id: request.params.id };
    const data = await HocusChallenge.findOne(filter);
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/fiveminuteclick", async (request, response) => {
  const data = new FiveMinuteClick(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/fiveminuteadd", async (request, response) => {
  const data = new FiveMinuteAdd(request.body);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/", async (request, response) => {
  response.send("Hello.");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
