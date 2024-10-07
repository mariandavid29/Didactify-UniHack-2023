import prisma from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      const dbUser = await prisma.User.findFirst({
        where: {
          email: token.email,
        },
      });
      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};

function getAuthSession() {
  return getServerSession(authOptions);
}

export { getAuthSession };
