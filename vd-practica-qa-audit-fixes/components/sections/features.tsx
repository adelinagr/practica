import Link from "next/link";

import { features } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section id="servicii">
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <HeaderSection
            label="Ce oferim"
            title="Servicii de digitalizare complete, de la A la Z"
            subtitle="De la evaluare și strategie, până la implementare și training — însoțim compania ta în fiecare etapă a transformării digitale."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = Icons[feature.icon || "nextjs"];
              return (
                <div
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8 transition-colors hover:bg-muted/50"
                  key={feature.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-sky-500/50 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-sky-500/20 dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6 bg-background">
                      <Icon />
                    </div>

                    {/* Titlul a fost adăugat aici pentru a fi vizibil pe site */}
                    <h3 className="mt-6 text-xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 pb-6 text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-4"
                      >
                        <Link href="#contact" className="flex items-center gap-2">
                          <span>Află mai multe</span>
                          <Icons.arrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}