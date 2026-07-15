import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminContentClient } from "@/components/admin/admin-content-client";

export const metadata = {
  title: "Conținut/Blog Admin – VreauDigitalizare",
};

export default async function AdminContentPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      imageUrl: true,
      published: true,
      createdAt: true,
    },
  });

  return <AdminContentClient initialData={posts} />;
}

