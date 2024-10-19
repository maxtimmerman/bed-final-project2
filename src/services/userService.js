import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getUsers(queryParams = {}) {
  const { username, email } = queryParams;

  const whereClause = {};
  if (username) whereClause.username = { contains: username };
  if (email) whereClause.email = { contains: email };

  return prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

export async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

export async function getUser(id) {
  console.log("Fetching user with ID:", id);
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

export async function updateUser(id, userData, requestingUserId) {
  const user = await getUser(id);
  if (!user) {
    throw new Error("Gebruiker niet gevonden");
  }

  if (id !== requestingUserId) {
    throw new Error("Onbevoegd");
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });
}

export async function deleteUser(id, requestingUserId) {
  if (id !== requestingUserId) {
    throw new Error("Unauthorized");
  }
  return prisma.user.delete({ where: { id } });
}
