const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const auth = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role.middleware");

router.post(
  "/doctor",
  auth,
  checkRole("ADMIN"),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "DOCTOR"
        },
      });

      res.status(201).json({ message: "Médecin créé avec succès", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
