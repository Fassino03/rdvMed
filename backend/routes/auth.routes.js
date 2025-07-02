const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const auth = require("../middlewares/auth.middleware");

router.post("/register", authController.register); // Patient seulement
router.post("/login", authController.login);

router.get("/me", auth, (req, res) => {
  res.status(200).json({ user: req.user });
});


module.exports = router;
