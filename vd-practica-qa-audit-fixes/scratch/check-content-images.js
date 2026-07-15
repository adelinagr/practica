const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post && post.content) {
    const images = post.content.match(/<img[^>]+src="([^">]+)"/g);
    console.log("IMAGES IN CONTENT:", images);
  } else {
    console.log("No post or no content");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
