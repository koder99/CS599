const express = require("express");
const router = express.Router();
const cors = require("cors");
const stateController = require("./../Controllers/stateController");

router.get("/random", cors(), stateController.getRandomState);
router.get("/pending", stateController.checkPending);

router
  .route("/:state")
  .get(cors(), stateController.getState)
  .patch(stateController.updateState)
  .delete(stateController.deleteState);

router
  .route("/")
  .get(cors(), stateController.getAllStates)
  .post(stateController.createState);

module.exports = router;
