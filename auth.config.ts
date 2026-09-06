import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard") || 
                          nextUrl.pathname.startsWith("/tools") ||
                          nextUrl.pathname.startsWith("/credits");
      const isAdmin = nextUrl.pathname.startsWith("/admin");

      if (isAdmin) {
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN";
      }

      if (isDashboard) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isUnlimited = (user as any).isUnlimited;
      } else if (token.email) {
        // Assegura que mudanças de permissão (ex: promoção para ADMIN ou isUnlimited) sejam recarregadas dinamicamente
        const adminEmails = ["rfpita.ti@gmail.com"];
        if (adminEmails.includes(token.email as string)) {
          token.role = "ADMIN";
          token.isUnlimited = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).isUnlimited = token.isUnlimited as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
