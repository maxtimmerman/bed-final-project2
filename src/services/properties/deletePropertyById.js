import { PrismaClient } from "@prisma/client";

const deletePropertyById = async (id) => {
  const prisma = new PrismaClient();
  const property = await prisma.property.deleteMany({
    where: { id },
  });

  return property;
};

export default deletePropertyById;
