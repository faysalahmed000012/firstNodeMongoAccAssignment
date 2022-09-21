const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const fs = require("fs");
const { json } = require("express");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Hello from Faysal");
});

app.get("/user/random", (req, res) => {
  const file = fs.readFileSync("users.data.json");
  const users = JSON.parse(file);
  const randIndex = Math.floor(Math.random() * users.length);
  const randomUser = users[randIndex];
  res.send(randomUser);
  console.log(randomUser);

  console.log(users.length);
});

app.get("/user/all", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  res.send(users);
});

app.post("/user/save", (req, res) => {
  const body = JSON.stringify(req.body, null, 2);
  const otherUsers = JSON.parse(fs.readFileSync("users.data.json"));
  const newUser = JSON.parse(body);
  const allUsers = [...otherUsers, newUser];
  const updatedAllUsers = JSON.stringify(allUsers, null, 2);

  fs.writeFile("users.data.json", updatedAllUsers, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });

  res.send("The user has been saved");
  console.log(newUser);
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
