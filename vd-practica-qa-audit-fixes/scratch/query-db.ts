import { prisma } from "../lib/db";

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      published: true
    }
  });
  console.log("POSTS:", JSON.stringify(posts, null, 2));
}

main().catch(console.error);
