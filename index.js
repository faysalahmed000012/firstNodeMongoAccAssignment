const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const fs = require("fs");

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
  const { limit } = req.query;
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  res.send(users.slice(0, limit));
});

app.post("/user/save", (req, res) => {
  const body = JSON.stringify(req.body, null, 2);
  const otherUsers = JSON.parse(fs.readFileSync("users.data.json"));
  const newUser = JSON.parse(body);
  if (
    !newUser.id ||
    !newUser.name ||
    !newUser.picture ||
    !newUser.gender ||
    !newUser.phone ||
    !newUser.address
  ) {
    res.send("please provide all the necessary information");
  } else {
    const allUsers = [...otherUsers, newUser];
    const updatedAllUsers = JSON.stringify(allUsers, null, 2);

    fs.writeFile("users.data.json", updatedAllUsers, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });

    res.send("The user has been saved");
    console.log(newUser);
  }
});

app.patch("/user/update", (req, res) => {
  const info = req.body;
  const id = req.body._id;
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  const user = users.find((user) => user._id == id);
  if (!user) {
    res.send("please provide a valid id");
  } else {
    user._id = id;
    info.picture && (user.picture = info.picture);
    info.name && (user.name = info.name);
    info.gender && (user.gender = info.gender);
    info.phone && (user.phone = info.phone);
    info.address && (user.address = info.address);
    const updatedList = JSON.stringify(users, null, 2);

    fs.writeFile("users.data.json", updatedList, (err) => {
      if (err) throw err;
      console.log("something went wrong");
    });
    res.send(users);
  }
});

app.patch("/user/bulk-update", (req, res) => {
  const body = req.body;
  const allUsers = JSON.parse(fs.readFileSync("users.data.json"));

  const listed = body.map((targeted) => {
    if (!targeted) {
      res.send("please provide valid information");
    } else if (
      !targeted._id &&
      !targeted.name &&
      !targeted.picture &&
      !targeted.address &&
      !targeted.phone &&
      !targeted.gender
    ) {
      res.send("please provide valid information");
    } else {
      const user = allUsers.find((person) => person._id == targeted._id);
      targeted.picture && (user.picture = targeted.picture);
      targeted.name && (user.name = targeted.name);
      targeted.gender && (user.gender = targeted.gender);
      targeted.phone && (user.phone = targeted.phone);
      targeted.address && (user.address = targeted.address);
    }
  });
  const updatedList = JSON.stringify(allUsers, null, 2);

  fs.writeFile("users.data.json", updatedList, (err) => {
    if (err) throw err;
    console.log("something went wrong");
  });

  res.send(allUsers);
});

app.delete("/user/delete", (req, res) => {
  const id = req.body._id;
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  const targetedUser = users.find((user) => user._id == id);
  if (!targetedUser) {
    res.send(`User with ${id} id does not exists`);
  } else {
    const otherUsers = users.filter((user) => user._id != id);
    const finalList = JSON.stringify(otherUsers, null, 2);
    fs.writeFileSync("users.data.json", finalList, (err) => {
      if (err) throw err;
      console.log("Sorry, there is a problem. Please try again later");
    });
    res.send("Successfully Deleted the user");
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
