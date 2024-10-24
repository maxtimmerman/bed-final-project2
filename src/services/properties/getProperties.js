import { PrismaClient } from "@prisma/client";

const getProperties = async (location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();

  console.log("Search params:", { location, pricePerNight, amenities });

  try {
    const whereClause = {};

    if (location) whereClause.location = location;
    if (pricePerNight) whereClause.pricePerNight = parseFloat(pricePerNight);
    if (amenities) {
      whereClause.amenities = {
        some: {
          name: amenities,
        },
      };
    }

    console.log("Where clause:", whereClause);

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        amenities: true,
        host: true,
      },
    });

    console.log("Found properties:", properties);

    return properties;
  } catch (error) {
    console.error("Error in getProperties:", error);
    throw error;
  }
};

export default getProperties;
