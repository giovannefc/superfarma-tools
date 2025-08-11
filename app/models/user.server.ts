import bcrypt from "bcryptjs";

import { prisma } from "~/lib/server";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.active) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      active: true,
    },
  });
}

// Tipos derivados das funções
export type UserFromLogin = Awaited<ReturnType<typeof login>>;
export type UserPublic = Awaited<ReturnType<typeof getUserById>>;
