import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";

import { prisma } from "~/lib/db.server";
import { sessionStorage } from "~/services/session.server";

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

// Create an instance of the authenticator
export const authenticator = new Authenticator<User>();

// Manual authentication functions
export async function authenticateUser(
  email: string,
  password: string,
): Promise<User> {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Email e senha são obrigatórios");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new Error("Email ou senha inválidos");
  }

  if (!user.active) {
    throw new Error("Usuário inativo");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Email ou senha inválidos");
  }

  return {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}

export async function getUser(request: Request): Promise<User | null> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const user = session.get("user");
  return user || null;
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}
