import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReviews() {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function createReview(reviewData) {
  return prisma.review.create({
    data: reviewData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function getReview(id) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function updateReview(id, reviewData) {
  return prisma.review.update({
    where: { id },
    data: reviewData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function deleteReview(id) {
  return prisma.review.delete({
    where: { id },
  });
}
