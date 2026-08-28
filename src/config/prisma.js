const { PrismaClient } = require('@prisma/client');

// Cria a conexão com o banco de dados via Prisma
const prisma = new PrismaClient();

module.exports = prisma;
