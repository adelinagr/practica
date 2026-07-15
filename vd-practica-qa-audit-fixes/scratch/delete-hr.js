const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.questionnaire.deleteMany({
    where: { slug: "evaluare-maturitate-hr" }
  });
  console.log("Deleted old HR questionnaire");
}

main().catch(console.error).finally(() => prisma.$disconnect());
