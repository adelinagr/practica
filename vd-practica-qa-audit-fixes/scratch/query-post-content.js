const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post) {
    console.log("CONTENT LENGTH:", post.content ? post.content.length : 0);
    console.log("CONTENT SAMPLE:", post.content ? post.content.substring(0, 500) : "");
  } else {
    console.log("Post not found");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
