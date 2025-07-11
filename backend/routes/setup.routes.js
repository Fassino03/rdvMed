const express = require("express");
const router = express.Router(); // ← Cette ligne manquait sûrement

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const INSTALL_KEY = process.env.INSTALLATION_SECRET_KEY;

router.post("/setup-admin", async (req, res) => {
  const { email, password, key, institutionName, institutionType } = req.body;

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return res.status(403).json({ message: "Un administrateur existe déjà." });
    }

    if (key !== INSTALL_KEY) {
      return res.status(401).json({ message: "Clé d'installation invalide." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        institutionName,
        institutionType,
      },
    });

    res.status(201).json({ message: "Administrateur créé avec succès", admin });
  } catch (error) {
    console.error("Erreur setup admin :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création de l’admin." });
  }
});

module.exports = router;
