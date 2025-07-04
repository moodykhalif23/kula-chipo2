import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      id?: string;
    };
  }

  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}
