const express = require("express");
const userControler = require("./controler/users.controler");
const router = express.Router();

// get routes

router.route("/all").get(userControler.seeAllUser);

router.route("/random").get(userControler.getRnadomUser);

//post route

router.route("/save").post(userControler.postUser);

// patch routes

router.route("/update").patch(userControler.updateAUser);

router.route("/bulk-update").patch(userControler.updateMultiple);

// delete route

router.route("/delete").delete(userControler.deleteAUser);

module.exports = router;
