import { PrismaClient } from "@prisma/client";

const updateBookingById = async (id, updatedBooking) => {
  const prisma = new PrismaClient();
  const { userId, propertyId, ...rest } = updatedBooking;

  const booking = await prisma.booking.updateMany({
    where: { id },
    data: {
      ...rest,
      userId: userId ? { connect: { id: userId } } : undefined,
      propertyId: propertyId ? { connect: { id: propertyId } } : undefined,
    },
  });

  return booking;
};

export default updateBookingById;
