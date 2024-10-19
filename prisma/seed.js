import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJsonFile(filename) {
  const filePath = path.join(__dirname, "..", "src", "data", filename);
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  const { users } = await readJsonFile("users.json");
  const { hosts } = await readJsonFile("hosts.json");
  const { properties } = await readJsonFile("properties.json");
  const { amenities } = await readJsonFile("amenities.json");
  const { bookings } = await readJsonFile("bookings.json");
  const { reviews } = await readJsonFile("reviews.json");

  // Seed users with hashed passwords
  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        ...user,
        password: hashedPassword,
      },
      create: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  // Seed hosts with hashed passwords
  for (const host of hosts) {
    const hashedPassword = await hashPassword(host.password);
    await prisma.host.upsert({
      where: { email: host.email },
      update: {
        ...host,
        password: hashedPassword,
      },
      create: {
        ...host,
        password: hashedPassword,
      },
    });
  }

  // Seed amenities
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      update: amenity,
      create: amenity,
    });
  }

  // Seed properties
  for (const property of properties) {
    const propertyAmenities = property.amenities || [];
    await prisma.property.upsert({
      where: { id: property.id },
      update: {
        ...property,
        amenities: {
          set: propertyAmenities.map((amenityId) => ({ id: amenityId })),
        },
      },
      create: {
        ...property,
        amenities: {
          connect: propertyAmenities.map((amenityId) => ({ id: amenityId })),
        },
      },
    });
  }

  // Seed bookings
  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {
        ...booking,
        checkinDate: new Date(booking.checkinDate),
        checkoutDate: new Date(booking.checkoutDate),
      },
      create: {
        ...booking,
        checkinDate: new Date(booking.checkinDate),
        checkoutDate: new Date(booking.checkoutDate),
      },
    });
  }

  // Seed reviews
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  console.log("Database has been seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
