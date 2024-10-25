import { PrismaClient } from "@prisma/client";

const deleteBookingById = async (id) => {
  const prisma = new PrismaClient();

  try {
    const booking = await prisma.booking.delete({
      where: { id },
    });
    return booking;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default deleteBookingById;
