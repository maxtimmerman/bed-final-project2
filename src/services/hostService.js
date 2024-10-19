import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getHosts(queryParams = {}) {
  const { name } = queryParams;

  const whereClause = {};
  if (name) whereClause.name = { contains: name };

  return prisma.host.findMany({
    where: whereClause,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });
}

export async function createHost(hostData) {
  const hashedPassword = await bcrypt.hash(hostData.password, 10);
  return prisma.host.create({
    data: {
      ...hostData,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });
}

export async function getHost(id) {
  return prisma.host.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });
}

export async function updateHost(id, hostData, requestingUserId) {
  if (id !== requestingUserId) {
    throw new Error("Unauthorized");
  }
  if (hostData.password) {
    hostData.password = await bcrypt.hash(hostData.password, 10);
  }
  return prisma.host.update({
    where: { id },
    data: hostData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      aboutMe: true,
    },
  });
}

export async function deleteHost(id, requestingUserId) {
  if (id !== requestingUserId) {
    throw new Error("Unauthorized");
  }
  return prisma.host.delete({ where: { id } });
}
