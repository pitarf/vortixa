// script de query simples
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function queryOutputs() {
  const inputs = await prisma.aIJobInput.findMany({
    where: {
      value: { contains: 'Virginia' }
    },
    include: {
      job: {
        include: {
          outputs: true,
          inputs: true,
          tool: true,
          model: true
        }
      }
    }
  });

  console.log('INPUTS_FOUND:', inputs.length);
  for (const item of inputs) {
    console.log('JOB:', item.jobId);
    console.log('TOOL:', item.job.tool?.name);
    console.log('OUTPUTS:', item.job.outputs);
    console.log('ALL_INPUTS:', item.job.inputs);
  }
}

queryOutputs()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

