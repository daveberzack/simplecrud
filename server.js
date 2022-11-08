const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
import cors from "cors";
const { HocusFeedback, HocusSolve } = require("./models");

const PORT = process.env.PORT || 3020;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://daveberzack:zNDEUMMtWlnmRZYi@cluster0.rddcyey.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
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

app.get("/", async (request, response) => {
  response.send("Hello.");
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
