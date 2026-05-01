import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthError } from "@auth/core/errors";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    role: "USER" | "SELLER" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "USER" | "SELLER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "SELLER" | "ADMIN";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  logger: {
    error(error) {
      if (error instanceof AuthError && error.type === "CredentialsSignin") {
        return;
      }

      const name = error instanceof AuthError ? error.type : error.name;
      console.error(`[auth][error] ${name}: ${error.message}`);
      if (error.stack) {
        console.error(error.stack);
      }
    },
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return null;
        }

        const valid = await compare(password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.id === "string" ? token.id : String(token.sub ?? "");
        session.user.role = (token.role ?? "USER") as
          | "USER"
          | "SELLER"
          | "ADMIN";
      }
      return session;
    },
  },
});
