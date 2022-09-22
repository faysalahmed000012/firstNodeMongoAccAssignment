const express = require("express");
const fs = require("fs");

// showing all user (query = limit)

module.exports.seeAllUser = (req, res) => {
  const { limit } = req.query;
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  res.send(users.slice(0, limit));
};

// get a random user

module.exports.getRnadomUser = (req, res) => {
  const file = fs.readFileSync("users.data.json");
  const users = JSON.parse(file);
  const randIndex = Math.floor(Math.random() * users.length);
  const randomUser = users[randIndex];
  res.send(randomUser);
  console.log(randomUser);

  console.log(users.length);
};

// post a new user

module.exports.postUser = (req, res) => {
  const body = JSON.stringify(req.body, null, 2);
  const otherUsers = JSON.parse(fs.readFileSync("users.data.json"));
  const newUser = JSON.parse(body);
  if (
    !newUser.id ||
    !newUser.name ||
    !newUser.photoUrl ||
    !newUser.gender ||
    !newUser.contact ||
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
};

// update a user

module.exports.updateAUser = (req, res) => {
  const info = req.body;
  const id = req.body._id;
  const users = JSON.parse(fs.readFileSync("users.data.json"));
  const user = users.find((user) => user._id == id);
  if (!user) {
    res.send("please provide a valid id");
  } else {
    user._id = id;
    info.photoUrl && (user.photoUrl = info.photoUrl);
    info.name && (user.name = info.name);
    info.gender && (user.gender = info.gender);
    info.contact && (user.contact = info.contact);
    info.address && (user.address = info.address);
    const updatedList = JSON.stringify(users, null, 2);

    fs.writeFile("users.data.json", updatedList, (err) => {
      if (err) throw err;
      console.log("something went wrong");
    });
    res.send(users);
  }
};

// update multiple user

module.exports.updateMultiple = (req, res) => {
  const body = req.body;
  const allUsers = JSON.parse(fs.readFileSync("users.data.json"));

  const listed = body.map((targeted) => {
    if (!targeted) {
      res.send("please provide valid information");
    } else if (
      !targeted._id &&
      !targeted.name &&
      !targeted.photoUrl &&
      !targeted.address &&
      !targeted.contact &&
      !targeted.gender
    ) {
      res.send("please provide valid information");
    } else {
      const user = allUsers.find((person) => person._id == targeted._id);
      targeted.photoUrl && (user.photoUrl = targeted.photoUrl);
      targeted.name && (user.name = targeted.name);
      targeted.gender && (user.gender = targeted.gender);
      targeted.contact && (user.contact = targeted.contact);
      targeted.address && (user.address = targeted.address);
    }
  });
  const updatedList = JSON.stringify(allUsers, null, 2);

  fs.writeFile("users.data.json", updatedList, (err) => {
    if (err) throw err;
    console.log("something went wrong");
  });

  res.send(allUsers);
};

// delete a user

module.exports.deleteAUser = (req, res) => {
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
};
