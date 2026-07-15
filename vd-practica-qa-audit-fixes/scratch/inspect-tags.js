const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: "filip-" }
  });
  if (post && post.content) {
    const tags = [];
    const regex = /<([a-z0-9]+)([^>]*)>/gi;
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      tags.push({ tag: match[1], attrs: match[2].trim() });
    }
    console.log("TOTAL TAGS:", tags.length);
    console.log("TAGS LIST:", tags.map(t => `${t.tag} (${t.attrs.substring(0, 100)})`));
  } else {
    console.log("No post or no content found");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
