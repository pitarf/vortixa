import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
console.log('Using DB URL:', connectionString?.split('@')[1]);
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'qa-tester@vorixa.com';
  const password = 'Password123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      isUnlimited: true,
      passwordHash,
    },
    create: {
      email,
      name: 'QA Automated Tester',
      role: 'ADMIN',
      isUnlimited: true,
      passwordHash,
      emailVerified: new Date(),
    },
  });

  await prisma.creditBalance.upsert({
    where: { userId: user.id },
    update: { balance: 999999 },
    create: { userId: user.id, balance: 999999 },
  });

  console.log('QA_USER_READY', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

