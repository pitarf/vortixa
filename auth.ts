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
        console.log("[AUTH-DEBUG] Raw credentials keys:", Object.keys(credentials || {}));
        const cleanEmail = (credentials?.email as string)?.trim().toLowerCase();
        const rawPassword = credentials?.password as string;
        console.log("[AUTH-DEBUG] Clean email:", cleanEmail, "Password len:", rawPassword?.length);

        if (!cleanEmail || !rawPassword) {
          console.log("[AUTH-DEBUG] Missing cleanEmail or rawPassword");
          return null;
        }
        
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: { equals: cleanEmail, mode: "insensitive" },
            },
          });

          console.log("[AUTH-DEBUG] User found in DB:", !!user, "id:", user?.id, "hasHash:", !!user?.passwordHash);

          if (!user || !user.passwordHash) {
            console.log("[AUTH-DEBUG] User or passwordHash missing");
            return null;
          }

          if (user.isBlocked) {
            console.warn(`[AUTH-DEBUG] Tentativa de login em conta bloqueada: ${cleanEmail}`);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            rawPassword,
            user.passwordHash
          );

          console.log("[AUTH-DEBUG] Passwords match result:", passwordsMatch);

          if (passwordsMatch) {
            console.log("[AUTH-DEBUG] Authentication SUCCESS for:", user.email);
            return user;
          }

          console.log("[AUTH-DEBUG] Passwords do NOT match!");
          return null;
        } catch (err: any) {
          console.error("[AUTH-DEBUG] Error during authorize:", err);
          return null;
        }
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

