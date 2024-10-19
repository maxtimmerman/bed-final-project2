import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBookings({ userId }) {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  return prisma.booking.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });
}

export async function createBooking(bookingData) {
  return prisma.booking.create({
    data: {
      ...bookingData,
      checkinDate: new Date(bookingData.checkinDate),
      checkoutDate: new Date(bookingData.checkoutDate),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });
}

export async function getBooking(id) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });
}

export async function updateBooking(id, bookingData) {
  if (bookingData.checkinDate)
    bookingData.checkinDate = new Date(bookingData.checkinDate);
  if (bookingData.checkoutDate)
    bookingData.checkoutDate = new Date(bookingData.checkoutDate);

  return prisma.booking.update({
    where: { id },
    data: bookingData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });
}

export async function deleteBooking(id) {
  return prisma.booking.delete({
    where: { id },
  });
}

// Additional function to check availability
export async function checkAvailability(propertyId, checkinDate, checkoutDate) {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      propertyId: propertyId,
      OR: [
        {
          AND: [
            { checkinDate: { lte: new Date(checkinDate) } },
            { checkoutDate: { gt: new Date(checkinDate) } },
          ],
        },
        {
          AND: [
            { checkinDate: { lt: new Date(checkoutDate) } },
            { checkoutDate: { gte: new Date(checkoutDate) } },
          ],
        },
        {
          AND: [
            { checkinDate: { gte: new Date(checkinDate) } },
            { checkoutDate: { lte: new Date(checkoutDate) } },
          ],
        },
      ],
    },
  });

  return overlappingBookings.length === 0;
}
