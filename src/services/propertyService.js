import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProperties(queryParams = {}) {
  const { location, pricePerNight, amenities } = queryParams;

  const whereClause = {};
  if (location) whereClause.location = { contains: location };
  if (pricePerNight)
    whereClause.pricePerNight = { lte: parseFloat(pricePerNight) };
  if (amenities) {
    whereClause.amenities = {
      some: {
        name: { in: amenities.split(",") },
      },
    };
  }

  return prisma.property.findMany({
    where: whereClause,
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      amenities: true,
    },
  });
}

export async function createProperty(propertyData, hostId) {
  const { amenities, ...rest } = propertyData;

  const property = await prisma.property.create({
    data: {
      ...rest,
      host: {
        connect: { id: hostId },
      },
      amenities: amenities
        ? {
            connect: amenities.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      amenities: true,
      host: true,
    },
  });

  return property;
}

export async function getProperty(id) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      amenities: true,
    },
  });
}

export async function updateProperty(id, propertyData) {
  const { amenities, ...rest } = propertyData;

  return prisma.property.update({
    where: { id },
    data: {
      ...rest,
      amenities: amenities
        ? {
            set: amenities.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      amenities: true,
    },
  });
}

export async function deleteProperty(id) {
  return prisma.property.delete({
    where: { id },
    select: { id: true }, // This ensures we return something even if the property is successfully deleted
  });
}
