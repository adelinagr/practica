import { prisma } from "@/lib/db";
import DirectoryClient from "@/components/questionnaire/DirectoryClient";

export const metadata = {
  title: "Chestionare de Evaluare | VreauDigitalizare",
  description: "Explorează colecția noastră de chestionare dinamice concepute pentru a evalua nivelul tău de digitalizare.",
};

export const revalidate = 0; // Force dynamic fetching for new questionnaires

async function seedHrQuestionnaire() {
  const slug1 = "evaluare-maturitate-hr";
  const existing1 = await prisma.questionnaire.findUnique({ where: { slug: slug1 } });
  if (!existing1) {
    await prisma.questionnaire.create({
      data: {
        slug: slug1,
        title: "Evaluare Maturitate Guvernanță HR",
        description: "Evaluează nivelul de maturitate al departamentului tău de resurse umane în ceea ce privește poziționarea, procesele, strategia și cultura organizațională.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug2 = "evaluare-planificare-hr";
  const existing2 = await prisma.questionnaire.findUnique({ where: { slug: slug2 } });
  if (!existing2) {
    await prisma.questionnaire.create({
      data: {
        slug: slug2,
        title: "Evaluare Planificare Resurse Umane",
        description: "Evaluează capacitatea companiei de a prognoza necesarul de personal, de a gestiona competențele, succesiunea și datele angajaților (Workforce Planning).",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug3 = "evaluare-recrutare-hr";
  const existing3 = await prisma.questionnaire.findUnique({ where: { slug: slug3 } });
  if (!existing3) {
    await prisma.questionnaire.create({
      data: {
        slug: slug3,
        title: "Evaluare Recrutare și Selecție HR",
        description: "Evaluează modul în care compania ta atrage, selectează și integrează talentele, analizând experiența candidaților și procesul de selecție.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug4 = "evaluare-performanta-hr";
  const existing4 = await prisma.questionnaire.findUnique({ where: { slug: slug4 } });
  if (!existing4) {
    await prisma.questionnaire.create({
      data: {
        slug: slug4,
        title: "Evaluare Performanță și Recompense HR",
        description: "Evaluează procesele de evaluare a performanței, stabilirea obiectivelor, managementul feedback-ului și echitatea recompenselor financiare și non-financiare.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug5 = "evaluare-dezvoltare-hr";
  const existing5 = await prisma.questionnaire.findUnique({ where: { slug: slug5 } });
  if (!existing5) {
    await prisma.questionnaire.create({
      data: {
        slug: slug5,
        title: "Evaluare Learning & Development HR",
        description: "Evaluează programele de instruire, identificarea nevoilor de training, cultivarea unei culturi de învățare continuă și dezvoltarea abilităților de leadership.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug6 = "evaluare-experienta-hr";
  const existing6 = await prisma.questionnaire.findUnique({ where: { slug: slug6 } });
  if (!existing6) {
    await prisma.questionnaire.create({
      data: {
        slug: slug6,
        title: "Evaluare Experiență și Retenție Angajați",
        description: "Evaluează experiența de lucru a angajaților, indicatorii de engagement, stresul, climatul organizațional și strategiile de loializare și retenție.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug7 = "evaluare-digitalizare-hr";
  const existing7 = await prisma.questionnaire.findUnique({ where: { slug: slug7 } });
  if (!existing7) {
    await prisma.questionnaire.create({
      data: {
        slug: slug7,
        title: "Evaluare Digitalizare HR",
        description: "Evaluează maturitatea digitală a proceselor de resurse umane, de la infrastructură digitală și automatizări până la self-service, reporting și data-driven people analytics.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }

  const slug8 = "evaluare-compliance-hr";
  const existing8 = await prisma.questionnaire.findUnique({ where: { slug: slug8 } });
  if (!existing8) {
    await prisma.questionnaire.create({
      data: {
        slug: slug8,
        title: "Evaluare Compliance & HR Risk Management",
        description: "Evaluează gradul de conformitate cu legislația muncii, administrarea documentelor, managementul disciplinar, procedurile SSM și medicina muncii din organizație.",
        status: "PUBLISHED",
        estimatedMinutes: 10,
      }
    });
  }
}

export default async function ChestionareSelectionPage() {
  await seedHrQuestionnaire();

  const questionnaires = await prisma.questionnaire.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-transparent">
      <DirectoryClient questionnaires={questionnaires} />
    </div>
  );
}
