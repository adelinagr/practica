export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
    {
      title: "Noutăți",
      slug: "news",
      description: "Noutăți, lansări și anunțuri oficiale de la echipa VreauDigitalizare.",
    },
    {
      title: "Educație",
      slug: "education",
      description: "Ghiduri, tutoriale și resurse utile pentru digitalizarea afacerii tale.",
    },
  ];

export const BLOG_AUTHORS = {
  mickasmt: {
    name: "Alexandru", // Numele care va apărea pe site
    image: "/_static/avatars/mickasmt.png", // Imaginea originală păstrată
    twitter: "vreaudigitalizare",
  },
  shadcn: {
    name: "Maria", // Numele care va apărea pe site
    image: "/_static/avatars/shadcn.jpeg", // Imaginea originală păstrată
    twitter: "vreaudigitalizare",
  },
};