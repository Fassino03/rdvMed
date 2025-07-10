const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSlot = async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const user = req.user;

  if (user.role !== "DOCTOR") {
    return res.status(403).json({ message: "Accès réservé aux médecins" });
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: "Heure de début invalide" });
    }

    // Vérifie les conflits de créneaux
    const conflicting = await prisma.slot.findFirst({
      where: {
        doctorId: user.id,
        AND: [
          { date: new Date(date) },
          {
            OR: [
              { startTime: { lt: end }, endTime: { gt: start } },
              { startTime: { gte: start, lt: end } }
            ]
          }
        ]
      }
    });

    if (conflicting) {
      return res.status(400).json({ message: "Conflit avec un autre créneau" });
    }

    const slot = await prisma.slot.create({
      data: {
        date: new Date(date),
        startTime: start,
        endTime: end,
        doctorId: user.id,
      },
    });

    res.status(201).json({ message: "Créneau créé", slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await prisma.slot.findMany({
      include: {
        doctor: {
          select: { id: true, email: true, role: true }
        }
      },
      orderBy: { date: "asc" }
    });

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

