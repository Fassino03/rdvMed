const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/appointment.controller");

router.post("/", auth, controller.bookAppointment);

module.exports = router;
