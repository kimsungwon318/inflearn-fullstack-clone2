import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePasswords } from "./lib/password-utils";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "email", placeholder: "이메일을 입력" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) {
          throw new Error("존재하지 않는 이메일입니다.");
        }

        const passwordsMatch = comparePasswords(
          credentials.password as string,
          user.hashedPassword as string
        );

        if (!passwordsMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
