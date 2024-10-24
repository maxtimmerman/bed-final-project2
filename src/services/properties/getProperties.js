import { PrismaClient } from "@prisma/client";

const getProperties = async (location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();

  // Log de inkomende parameters
  console.log("Search params:", { location, pricePerNight, amenities });

  const properties = await prisma.property.findMany({
    where: {
      ...(location
        ? {
            location: {
              equals: location.trim(), // Verwijder whitespace en gebruik exacte match
            },
          }
        : {}),
      ...(pricePerNight
        ? {
            pricePerNight: {
              equals: parseFloat(pricePerNight),
            },
          }
        : {}),
      ...(amenities
        ? {
            amenities: {
              some: {
                name: amenities,
              },
            },
          }
        : {}),
    },
    include: {
      amenities: true,
    },
  });

  // Log wat we vonden
  console.log("Found properties:", properties);

  return properties;
};

export default getProperties;
