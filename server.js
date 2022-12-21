require('dotenv').config();
const AWS = require("aws-sdk");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { HocusChallenge, HocusFeedback, HocusSolve, PageView, FiveMinuteAdd, FiveMinuteClick } = require("./models");
const { formatTablePage, getDayString } = require("./utils");


const PORT = process.env.PORT || 3020;
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const generateRandomString = (myLength) => {
  const chars ="AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );
  const randomString = randomArray.join("");
  return randomString;
};

const putImage = async (image) => {
  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const type = image.split(';')[0].split('/')[1];
  const fileKey = generateRandomString(10);

  const params = {
    Bucket: 'hocus-focus',
    Key: `uploads/${fileKey}.${type}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`
  }

  try {
    await s3.upload(params).promise();
  } catch (error) {
    console.log("put image error",error);
  }
  return fileKey;
}

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
  const fileKey = await putImage(bodyData.image);

  console.log("xmas",bodyData.beforeMessages);
  const backgroundImageUrl = "./img/themes/bgs/"+bodyData.theme+".jpg";
  const instructionsBody = "<p>This holiday card is a puzzle to find something in a hidden picture.</p><p>Swipe around the canvas to paint blocks of color. Paint over those areas to reveal finer details.</p><p>Keep going until you understand the picture enough to find the goal, then click it to solve the puzzle.</p>";
  const instructionsTitle = "How to Play";
  const challengeData = {
    clue: bodyData.clue,
    imageKey: fileKey,
    hitAreas: bodyData.hitAreas,
    goals: [20,40,60,90,120],
    beforeMessages: [
      {
        body: bodyData.beforeMessage,
        title: bodyData.beforeTitle,
        button: "Open Card",
        backgroundImageUrl
      },
      {
        body: instructionsBody,
        title: instructionsTitle,
        button: "Play"
      }
    ]
  }
  console.log("xmas challenge",challengeData);
  const data = new HocusChallenge(challengeData);
  try {
    await data.save();
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
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


app.get("/hocusdeleteimpermanentchallenges/", async (request, response) => {
  try {
    const filter = { isPermanent: { $exists: false } };
    const result = await HocusChallenge.deleteMany(filter, function (err) {});
    //const result = await HocusChallenge.find(filter);
    console.log("deleted", result)
    response.send("it is done");
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/hocustodaychallenge/", async (request, response) => {
  try {
    const filter = { date: getDayString(0) };
    const data = await HocusChallenge.findOne(filter);
    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/hocusyesterdayscores/", async (request, response) => {
  try {
    const date = getDayString(-1);
    const challengeFilter = { date };
    const challenge = await HocusChallenge.findOne(challengeFilter);

    const solveFilter = {challengeId: challenge._id};
    const solves = await HocusSolve.find(solveFilter);
    const scores = [0,0,0,0,0,0];
    solves.map( s => {
      const i = s.stars;
      scores[i] = scores[i]+1;
    });

    data = {
      scores,
      clue: challenge.clue,
      date
    }

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


app.get("/update", async (request, response) => {
  try {
    const data = await HocusChallenge.updateMany({ $set: { goals: [15,30,45,60,90] } });
    console.log("updated",data);
    response.send("updated");
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/", async (request, response) => {
  response.send("Simple Crud is operational.");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
