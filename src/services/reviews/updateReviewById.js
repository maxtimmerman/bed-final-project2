import { PrismaClient } from "@prisma/client";

const updateReviewById = async (id, updatedReview) => {
  const prisma = new PrismaClient();
  const { userId, propertyId, ...rest } = updatedReview;

  const review = await prisma.review.updateMany({
    where: { id },
    data: {
      ...rest,
      userId: userId ? { connect: { id: userId } } : undefined,
      propertyId: propertyId ? { connect: { id: propertyId } } : undefined,
    },
  });

  return review;
};

export default updateReviewById;
