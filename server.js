const AWS = require("aws-sdk");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { HocusChallenge, HocusFeedback, HocusSolve, PageView, FiveMinuteAdd, FiveMinuteClick } = require("./models");
const { formatTablePage, getTodayString } = require("./utils");


const PORT = process.env.PORT || 3020;
const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
// })
const s3 = new AWS.S3({
  accessKeyId: "AKIAXBHKRV7MWNVMV2U3",
  secretAccessKey: "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",
  region:"us-east-1"
})
const s3Bucket = new AWS.S3( { params: {Bucket: 'hocus-focus'} } );

const putImage = async (image) => {

  
  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const type = base64.split(';')[0].split('/')[1];

  //const userId = 1;

  const params = {
    Bucket: s3Bucket,
    Key: `${userId}.${type}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`
  }

  let location = '';
  let key = '';
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.log("put image error",error);
  }

  console.log(location, key);

  return location;

  // var buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  // var data = {
  //   Key: req.body.userId, 
  //   Body: buf,
  //   ContentEncoding: 'base64',
  //   ContentType: 'image/jpeg'
  // };
  // s3Bucket.putObject(data, function(err, data){
  //     if (err) { 
  //       console.log(err);
  //       console.log('Error uploading data: ', data); 
  //     } else {
  //       console.log('successfully uploaded the image!');
  //     }
  // });
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
  console.log("XMas Data:",bodyData);
  const imageUrl = await putImage(bodyData.image);

  const challengeData = {
    clue: bodyData.clue,
    imageUrl,
    hitAreas: bodyData.strokes,
    goals: [20,40,60,90,120],
    beforeMessages: [
      {
        body: bodyData.beforeMessage,
        title: bodyData.beforeTitle,
        button: "Play"
      }
    ]
  }

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
