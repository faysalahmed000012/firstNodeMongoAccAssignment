const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Hello from Faysal");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
