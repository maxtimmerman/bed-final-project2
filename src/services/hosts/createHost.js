import { PrismaClient } from "@prisma/client";

const createHost = async (newHost) => {
  const prisma = new PrismaClient();
  try {
    const timestamp = Date.now();
    const host = await prisma.host.create({
      data: {
        ...newHost,
        username: `${timestamp}_${newHost.username}`, // Maak username uniek
        email: `${timestamp}_${newHost.email}`, // Maak email uniek
      },
    });
    return host;
  } catch (error) {
    console.error("Error creating host:", error);
    throw error;
  }
};

export default createHost;
