const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post && post.content) {
    const images = post.content.match(/<img[^>]+src="([^">]+)"/g);
    console.log("IMAGES COUNT:", images ? images.length : 0);
    if (images) {
      images.forEach((img, i) => console.log(`IMAGE ${i}:`, img));
    }
  } else {
    console.log("No post or no content");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
