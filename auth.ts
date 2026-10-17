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
        const cleanEmail = (credentials?.email as string)?.trim().toLowerCase();
        const rawPassword = credentials?.password as string;

        if (!cleanEmail || !rawPassword) {
          console.warn("[AUTH] Tentativa de login sem e-mail ou sem senha.");
          return null;
        }
        
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: { equals: cleanEmail, mode: "insensitive" },
            },
          });

          if (!user || !user.passwordHash) {
            console.warn(`[AUTH] Usuário não encontrado ou sem hash de senha: ${cleanEmail}`);
            return null;
          }

          if (user.isBlocked) {
            console.warn(`[AUTH] Tentativa de login em conta bloqueada: ${cleanEmail}`);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            rawPassword,
            user.passwordHash
          );

          console.log(`[AUTH] Verificação de credenciais para ${cleanEmail}: ${passwordsMatch ? "SUCESSO" : "SENHA_INCORRETA"}`);

          if (passwordsMatch) return user;

          return null;
        } catch (err: any) {
          console.error("[AUTH] Erro ao autenticar credenciais:", err);
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

