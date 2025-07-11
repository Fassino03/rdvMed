const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../middlewares/auth.middleware");

// ✅ Récupérer les RDV pour le patient connecté
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let whereCondition = {};

    if (role === "PATIENT") {
      whereCondition = { patientId: userId };
    } else if (role === "DOCTOR") {
      whereCondition = { doctorId: userId };
    } else {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const appointments = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        slot: true,
        doctor: true,
        patient: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({ appointments });
  } catch (error) {
    console.error("Erreur récupération RDV :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
  }
});

module.exports = router;
