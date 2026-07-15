const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post && post.content) {
    const match = post.content.match(/<img[^>]+>/);
    if (match) {
      console.log("FULL IMG TAG:", match[0].substring(0, 300) + "...");
    } else {
      console.log("No img tag found");
    }
  } else {
    console.log("No post or no content");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
