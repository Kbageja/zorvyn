import pkg from 'pg';
const { Pool } = pkg;

import { PrismaPg } from '@prisma/adapter-pg';  // ESM — named import works fine

import prismaClientPkg from '@prisma/client';
const { PrismaClient } = prismaClientPkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;