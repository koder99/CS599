const express = require("express");
const router = express.Router();
const viewController = require("./../Controllers/viewController");

router.get("/home", viewController.home);
router.get("/docs", viewController.documentation);
router.get("/random", viewController.getRandomState, viewController.getState);
router.get("/s/:state", viewController.getState);
router.get("/", viewController.home);

module.exports = router;
