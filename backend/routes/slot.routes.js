const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/slot.controller");

router.post("/", auth, controller.createSlot);
router.get("/", controller.getAllSlots);


module.exports = router;
