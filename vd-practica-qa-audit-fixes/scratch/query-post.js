const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  console.log("POST:", JSON.stringify(post, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
