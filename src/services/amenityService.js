import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAmenities() {
  return prisma.amenity.findMany();
}

export async function createAmenity(amenityData) {
  return prisma.amenity.create({
    data: amenityData,
  });
}

export async function getAmenity(id) {
  return prisma.amenity.findUnique({
    where: { id },
  });
}

export async function updateAmenity(id, amenityData) {
  return prisma.amenity.update({
    where: { id },
    data: amenityData,
  });
}

export async function deleteAmenity(id) {
  return prisma.amenity.delete({ where: { id } });
}
