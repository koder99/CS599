const express = require("express");
const router = express.Router();
const userController = require("./../Controllers/userController");

router.route("/slugify").get(userController.slugify);
router.get("/defective", userController.checkPosition);
router.get("resize", userController.resizeImages);

router
  .route("/s/:slug")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/p")
  .post(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
