const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post && post.content) {
    fs.writeFileSync(path.join(__dirname, "filip-content.html"), post.content);
    console.log("Wrote filip-content.html, length:", post.content.length);
  } else {
    console.log("No post or no content found");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
