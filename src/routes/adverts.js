const express = require("express");
const router = express.Router();

const advertController = require("../controllers/advertController")

router.get("/advertise", advertController.index);
router.get("/advertise/new", advertController.new);
router.post("/advertise/create", advertController.create);
router.get("/advertise/:id", advertController.show);
router.post("/advertise/:id/destroy", advertController.destroy);
router.get("/advertise/:id/edit", advertController.edit);
router.post("/advertise/:id/update", advertController.update);

module.exports = router;
