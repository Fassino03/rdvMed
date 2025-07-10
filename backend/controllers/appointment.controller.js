const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.bookAppointment = async (req, res) => {
  const user = req.user;
  const { slotId } = req.body;

  if (user.role !== "PATIENT") {
    return res.status(403).json({ message: "Seuls les patients peuvent réserver." });
  }

  try {
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { appointment: true },
    });

    if (!slot) {
      return res.status(404).json({ message: "Créneau introuvable." });
    }

    if (slot.appointment) {
      return res.status(400).json({ message: "Créneau déjà réservé." });
    }

    const appointment = await prisma.appointment.create({
      data: {
        slotId: slot.id,
        doctorId: slot.doctorId,
        patientId: user.id,
      },
    });

    res.status(201).json({ message: "Rendez-vous confirmé", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
