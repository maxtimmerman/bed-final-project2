import { PrismaClient } from "@prisma/client";

const deleteReviewById = async (id) => {
  const prisma = new PrismaClient();
  const review = await prisma.review.deleteMany({
    where: { id },
  });

  return review;
};

export default deleteReviewById;
