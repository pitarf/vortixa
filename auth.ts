import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      const uid = user?.id;
      if (uid) {
        try {
          const isAdminMaster = user.email?.toLowerCase() === "rfpita.ti@gmail.com";

          // Inicializar saldo de 10 créditos bônus para conta criada via OAuth
          await prisma.$transaction(async (tx) => {
            if (isAdminMaster) {
              await tx.user.update({
                where: { id: uid },
                data: { role: "ADMIN", isUnlimited: true },
              });
            }

            await tx.creditBalance.upsert({
              where: { userId: uid },
              create: {
                userId: uid,
                balance: 10,
              },
              update: {},
            });

            await tx.creditTransaction.create({
              data: {
                userId: uid,
                amount: 10,
                type: "BONUS",
                description: "Boas-vindas VORTIXIA (Cadastro Google)",
              },
            });
          });
        } catch (e) {
          console.error("Erro ao inicializar bônus de boas-vindas OAuth:", e);
        }
      }
    },
  },
});

