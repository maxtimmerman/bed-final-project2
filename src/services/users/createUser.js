import { PrismaClient } from "@prisma/client";

const createUser = async (newUser) => {
  const prisma = new PrismaClient();
  try {
    const timestamp = Date.now();
    const user = await prisma.user.create({
      data: {
        ...newUser,
        username: `${timestamp}_${newUser.username}`, // Maak username uniek
        email: `${timestamp}_${newUser.email}`, // Maak email uniek
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export default createUser;
