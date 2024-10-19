import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function login(usernameOrEmail, password) {
  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });

    let role = "user";

    if (!user) {
      user = await prisma.host.findFirst({
        where: {
          OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        },
      });
      role = "host";
    }

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
