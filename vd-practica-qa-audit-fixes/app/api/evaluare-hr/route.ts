import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Define the 8 sub-dimensions of Modules 1 and 2
// Define the sub-dimensions of Modules 1, 2, and 3
const SUB_DIMENSIONS = [
  { id: "positioning", name: "1.1 Poziționarea funcției HR", qIds: ["HRG1", "HRG2", "HRG3", "HRG4", "HRG5"] },
  { id: "processes", name: "1.2 Procese și politici", qIds: ["HRG6", "HRG7", "HRG8"] },
  { id: "strategy", name: "1.3 Strategie HR", qIds: ["HRG9", "HRG10", "HRG11"] },
  { id: "culture", name: "1.4 Cultura organizațională", qIds: ["HRG12", "HRG13"] },
  
  { id: "planning", name: "2.1 Planificarea personalului", qIds: ["WFP1", "WFP2", "WFP3"] },
  { id: "competencies", name: "2.2 Structură și competențe", qIds: ["WFP4", "WFP5", "WFP6"] },
  { id: "succession", name: "2.3 Succesiune și mobilitate", qIds: ["WFP7", "WFP8", "WFP9"] },
  { id: "data", name: "2.4 Date și evidențe", qIds: ["WFP10", "WFP11"] },

  { id: "rec_prep", name: "3.1 Pregătirea recrutării (Recruitment Preparation)", qIds: ["REC1", "REC2", "REC3"] },
  { id: "cand_attr", name: "3.2 Atragerea candidaților (Candidate Attraction)", qIds: ["REC4", "REC5", "REC6"] },
  { id: "sel_disc", name: "3.3 & 3.4 Disciplina selecției (Selection Discipline)", qIds: ["REC7", "REC8", "REC9", "REC10", "REC11", "REC12", "REC13"] },
  { id: "cand_exp", name: "3.5 & 3.6 Experiența candidaților (Candidate Experience)", qIds: ["REC14", "REC15", "REC16"] },

  { id: "perf_framework", name: "4.1 Cadru management performanță (Performance Framework)", qIds: ["PER1", "PER2", "PER3", "PER4", "PER5"] },
  { id: "perf_dialogue", name: "4.2 Dialog & Feedback", qIds: ["PER6", "PER7", "PER8"] },
  { id: "rewards", name: "4.3 & 4.4 Compensare și Motivare", qIds: ["PER9", "PER10", "PER11", "PER12", "PER13", "PER14", "PER15", "PER16"] },
  { id: "satisfaction", name: "4.5 & 4.6 Voce, Satisfacție & Meritocrație", qIds: ["PER17", "PER18", "PER19", "PER20"] },

  { id: "lnd_strategy", name: "5.1 & 5.2 Strategie & Analiză Nevoi", qIds: ["LND1", "LND2", "LND3", "LND4", "LND5", "LND6"] },
  { id: "lnd_delivery", name: "5.3 Formate & Livrare", qIds: ["LND7", "LND8", "LND9", "LND10"] },
  { id: "lnd_culture", name: "5.4 & 5.5 Cultură de învățare & Leadership", qIds: ["LND11", "LND12", "LND13", "LND14", "LND15"] },
  { id: "lnd_career", name: "5.6 & 5.7 Carieră & Eficacitate", qIds: ["LND16", "LND17", "LND18", "LND19"] },

  { id: "exp_monitoring", name: "6.1 & 6.2 Monitorizare & Employee Voice", qIds: ["EXR1", "EXR2", "EXR3", "EXR4", "EXR5", "EXR6"] },
  { id: "wellbeing", name: "6.3 Wellbeing & Climat de lucru", qIds: ["EXR7", "EXR8", "EXR9"] },
  { id: "ret_strategy", name: "6.4 & 6.5 Strategie de Retenție", qIds: ["EXR10", "EXR11", "EXR12", "EXR13", "EXR14"] },
  { id: "loyalty", name: "6.6 & 6.7 Loialitate & Mobilitate", qIds: ["EXR15", "EXR16", "EXR17", "EXR18"] },

  { id: "dig_infra_security", name: "7.1 & 7.6 Infrastructură și Securitate", qIds: ["DIG1", "DIG2", "DIG3", "DIG13", "DIG14"] },
  { id: "dig_automation", name: "7.2 Procese și Automatizare", qIds: ["DIG4", "DIG5"] },
  { id: "dig_self_service_comm", name: "7.3 & 7.5 Self-Service și Comunicare", qIds: ["DIG6", "DIG7", "DIG11", "DIG12"] },
  { id: "dig_analytics_readiness", name: "7.4 & 7.7 Reporting, Analytics & Readiness", qIds: ["DIG8", "DIG9", "DIG10", "DIG15", "DIG16"] },

  { id: "com_doc_legal", name: "8.1 & 8.2 Documentație și Conformitate", qIds: ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"] },
  { id: "com_relations", name: "8.3 Relații de Muncă și Disciplină", qIds: ["COM7", "COM8", "COM9"] },
  { id: "com_health_safety", name: "8.4 Sănătate, Securitate și Medicină", qIds: ["COM10", "COM11", "COM12"] },
  { id: "com_audit_ethics", name: "8.5 & 8.6 Audit, Prevenire Riscuri și Etică", qIds: ["COM13", "COM14", "COM15", "COM16", "COM17"] },
];

const PREDEFINED_RECOMMENDATIONS = {
  positioning: {
    critical: [
      "Responsabilizați o persoană dedicată pentru activitățile de HR din organizație.",
      "Formalizați clar rolul de HR în organigrama companiei pentru a asigura vizibilitate.",
      "Includeți reprezentantul HR în ședințele de decizie ale managementului."
    ],
    improvement: [
      "Creșteți nivelul de colaborare între HR și managerii de linie prin întâlniri săptămânale.",
      "Asigurați cursuri și certificări relevante pentru responsabilul de HR.",
      "Definiți mai clar rolul și așteptările de la funcția de HR în companie."
    ],
    strength: [
      "Mențineți rolul strategic al HR-ului prin implicarea continuă în planificarea de business.",
      "Promovați un parteneriat strâns între HR și toți managerii operaționali."
    ]
  },
  processes: {
    critical: [
      "Documentați imediat politicile esențiale de HR (recrutare, concedii, regulament intern).",
      "Standardizați aplicarea politicilor pentru a evita discrepanțele între departamente."
    ],
    improvement: [
      "Începeți monitorizarea periodică a indicatorilor de bază de HR (ex. fluctuație, absenteism).",
      "Actualizați procedurile de resurse umane pentru a reflecta procesele curente."
    ],
    strength: [
      "Procesele și procedurile sunt complete, actualizate și aplicate uniform în organizație."
    ]
  },
  strategy: {
    critical: [
      "Definiți obiective de bază pentru HR conectate cu planurile anuale ale companiei.",
      "Alocați un buget minim dedicat exclusiv inițiativelor de personal (recrutare, training)."
    ],
    improvement: [
      "Elaborați un plan anual de HR structurat pe bază de KPIs clari.",
      "Planificați din timp inițiative proactive pentru retenția și atragerea personalului."
    ],
    strength: [
      "HR dispune de buget dedicat și planificare strategică strâns aliniată la business."
    ]
  },
  culture: {
    critical: [
      "Definiți clar valorile companiei și comunicați-le activ către toți angajații.",
      "Schimbați focusul de la o abordare pur operațională a angajaților spre una centrată pe oameni."
    ],
    improvement: [
      "Integrați valorile companiei în procesul de evaluare și recunoaștere a performanței.",
      "Dezvoltați inițiative simple pentru îmbunătățirea culturii de tip 'People-First'."
    ],
    strength: [
      "Oamenii sunt tratați ca o resursă strategică valoroasă, iar cultura este un diferențiator."
    ]
  },
  planning: {
    critical: [
      "Dezvoltați scenarii de forecast pe termen scurt bazate pe planul operațional al companiei.",
      "Evitați angajările reactive, pur ad-hoc; definiți necesarul de personal trimestrial."
    ],
    improvement: [
      "Implementați o rutină anuală de revizuire a necesarului de personal legată direct de buget.",
      "Monitorizați fluctuația pe departamente pentru a identifica zonele cu risc ridicat."
    ],
    strength: [
      "Prognoza resurselor este stabilă și se bazează pe scenarii de business."
    ]
  },
  competencies: {
    critical: [
      "Creați imediat o listă centralizată a posturilor și a competențelor esențiale aferente fiecăruia.",
      "Evaluați distribuția rolurilor în echipe pentru a evita suprapunerile de activități."
    ],
    improvement: [
      "Dezvoltați o matrice de competențe (skill matrix) actualizată anual pentru rolurile-cheie.",
      "Identificați skill-urile deficitare sau critice care vor fi necesare în viitor."
    ],
    strength: [
      "Aveți o evidență excelentă a competențelor și planificați proactiv dezvoltarea acestora."
    ]
  },
  succession: {
    critical: [
      "Identificați posturile critice a căror vacantare ar bloca activitatea companiei.",
      "Definiți planuri simple de succesiune (cine poate prelua rolul în caz de urgență)."
    ],
    improvement: [
      "Creați o procedură de promovare internă pentru a încuraja mobilitatea angajaților.",
      "Stabiliți planuri formale de succesiune pentru primele 2 niveluri de management."
    ],
    strength: [
      "Mobilitatea internă este activă și aveți succesori pregătiți pentru rolurile critice."
    ]
  },
  data: {
    critical: [
      "Centralizați toate datele de bază ale angajaților într-un singur fișier sau software securizat.",
      "Eliminați procesele de HR pe suport de hârtie pentru datele de prezență și personal."
    ],
    improvement: [
      "Implementați un instrument de bază de HR analytics pentru a fundamenta deciziile pe date.",
      "Asigurați accesul rapid și securizat al managerilor la datele de echipă."
    ],
    strength: [
      "Deciziile de personal se bazează pe date structurate și analize avansate de HR data."
    ]
  },
  rec_prep: {
    critical: [
      "Creați fișe de post clare și actualizate pentru toate rolurile active din companie.",
      "Definiți profilul candidatului ideal înainte de începerea oricărui proces de recrutare."
    ],
    improvement: [
      "Planificați necesarul de personal trimestrial pentru a reduce recrutarea exclusiv reactivă.",
      "Revizuiți fișele de post împreună cu managerii de departamente cel puțin o dată pe an."
    ],
    strength: [
      "Planificarea recrutării este predictivă și aliniată la previziunile de business."
    ]
  },
  cand_attr: {
    critical: [
      "Diversificați canalele de sourcing utilizate pentru a atrage candidați calificați (LinkedIn, job boards, rețele sociale).",
      "Lansați un program simplu de recomandări interne (employee referral)."
    ],
    improvement: [
      "Dezvoltați o pagină de cariere dedicată și prezentați testimoniale ale angajaților.",
      "Dezvoltați parteneriate cu universități sau asociații pentru atragerea de tinere talente."
    ],
    strength: [
      "Compania are o prezență puternică de employer branding și foloseusele o strategie de sourcing multi-channel."
    ]
  },
  sel_disc: {
    critical: [
      "Stabiliți un set clar de criterii de selecție înainte de începerea interviurilor.",
      "Definiți clar rolurile și responsabilitățile în recrutare între HR și managerii operaționali."
    ],
    improvement: [
      "Utilizați ghiduri de interviu structurate sau semistructurate pentru a asigura obiectivitatea.",
      "Introduceți instrumente de evaluare suplimentare (studii de caz, teste practice) pentru rolurile cheie."
    ],
    strength: [
      "Deciziile de selecție sunt obiective, bine documentate și bazate pe instrumente de evaluare calibrate."
    ]
  },
  cand_exp: {
    critical: [
      "Trimiteți un mesaj de confirmare și feedback candidaților refuzați pentru a proteja brandul de angajator.",
      "Formalizați procesul de handoff (transferul de informații) de la recrutare la onboarding."
    ],
    improvement: [
      "Colectați feedback de la candidați la finalul procesului de recrutare pentru a identifica punctele slabe.",
      "Standardizați șabloanele de comunicare pentru fiecare etapă a procesului de selecție."
    ],
    strength: [
      "Experiența candidaților este monitorizată sistematic, iar transferul către onboarding este fluid și integrat."
    ]
  },
  perf_framework: {
    critical: [
      "Stabiliți un proces formal minim de evaluare a performanței pentru a alinia eforturile echipei.",
      "Definiți obiective de performanță individuale clare pentru fiecare angajat.",
      "Creați criterii de succes clare și măsurabile, evitând evaluările pur subiective."
    ],
    improvement: [
      "Standardizați indicatorii de performanță (KPIs) la nivel de departamente.",
      "Comunicați transparent criteriile de evaluare înainte de începerea perioadei de performanță.",
      "Asigurați calibrarea obiectivelor între echipe pentru a asigura un nivel de dificultate echitabil."
    ],
    strength: [
      "Cadrul de performanță este solid, transparent și bine corelat cu obiectivele strategice ale companiei."
    ]
  },
  perf_dialogue: {
    critical: [
      "Instruiți managerii să ofere feedback regulat, nu doar în momente de criză sau urgențe.",
      "Stabiliți întâlniri formale periodice (ex. trimestriale) dedicate discuției despre progres și performanță."
    ],
    improvement: [
      "Dezvoltați o cultură a feedback-ului bidirecțional și continuu în cadrul echipelor.",
      "Asigurați-vă că evaluările de performanță se finalează cu planuri de acțiune clare."
    ],
    strength: [
      "Există un dialog matur de performanță și feedback-ul continuu este integrat în cultura de management."
    ]
  },
  rewards: {
    critical: [
      "Definiți criterii clare și obiective pentru acordarea bonusurilor și a altor recompense financiare.",
      "Eliminați deciziile salariale pur subiective sau ad-hoc pentru a preveni demotivarea.",
      "Implementați forme de recunoaștere non-financiară pentru performeri."
    ],
    improvement: [
      "Corelați o parte din remunerarea variabilă direct cu atingerea obiectivelor evaluate.",
      "Realizați un studiu de benchmarking salarial pentru a asigura competitivitatea pe piață.",
      "Dezvoltați o schemă formală de beneficii flexibile sau recunoaștere (recognition)."
    ],
    strength: [
      "Sistemul de recompense este echitabil, transparent și corelat strâns cu performanța individuală și de business."
    ]
  },
  satisfaction: {
    critical: [
      "Începeți monitorizarea satisfacției angajaților pentru a detecta din timp riscurile de plecare.",
      "Asigurați-vă că promovările se bazează pe performanță obiectivă și meritocrație, nu pe preferințe."
    ],
    improvement: [
      "Implementați un sondaj anual de satisfacție cu un plan de follow-up asumat de management.",
      "Publicați criterii transparente pentru promovări și evoluția în carieră."
    ],
    strength: [
      "Promovările sunt meritocratice, iar satisfacția angajaților este monitorizată și integrată în deciziile cheie."
    ]
  },
  lnd_strategy: {
    critical: [
      "Definiți prioritățile de dezvoltare a competențelor conectate cu nevoile operaționale imediate.",
      "Alocați un buget anual specific, chiar și minim, dedicat trainingului și formării.",
      "Formalizați procesul de analiză a nevoilor de instruire din companie."
    ],
    improvement: [
      "Implicați activ managerii în identificarea skill gap-urilor din echipe.",
      "Utilizați rezultatele din evaluările de performanță pentru a stabili planurile individuale de training.",
      "Corelați strategia de L&D cu obiectivele strategice ale business-ului pe termen mediu."
    ],
    strength: [
      "Dețineți o strategie matură de învățare cu buget dedicat și nevoi identificate sistematic."
    ]
  },
  lnd_delivery: {
    critical: [
      "Inițiați programe de instruire de bază pentru noii angajați și rolurile tehnice.",
      "Diversificați formatele de învățare dincolo de prezentările simple ad-hoc."
    ],
    improvement: [
      "Dezvoltați un program intern de formatori (internal trainers) pentru a păstra know-how-ul.",
      "Utilizați expertiză externă sau platforme de e-learning pentru a acoperi abilitățile deficitare."
    ],
    strength: [
      "Ecosistemul de livrare a trainingului este diversificat, utilizând eficient resurse interne și externe."
    ]
  },
  lnd_culture: {
    critical: [
      "Încurajați activ schimbul de experiență și cunoștințe între colegi în mod informal.",
      "Dezvoltați un program minim de onboarding managerial pentru noii lideri promovați."
    ],
    improvement: [
      "Lansați o academie sau un program structurat de leadership pentru manageri.",
      "Implementați sesiuni formale de 'lessons learned' sau 'peer sharing' după proiectele majore."
    ],
    strength: [
      "Organizația are o cultură puternică de învățare continuă, susținută prin programe solide de leadership."
    ]
  },
  lnd_career: {
    critical: [
      "Inițiați discuții clare cu angajații despre traseul lor profesional în companie.",
      "Creați oportunități de mobilitate internă pentru a evita plafonarea oamenilor cheie."
    ],
    improvement: [
      "Evaluați eficacitatea instruirilor prin indicatori de transfer al cunoștințelor în activitatea zilnică.",
      "Definiți planuri de carieră clare (career paths) pentru principalele familii de posturi."
    ],
    strength: [
      "Dezvoltarea carierei este structurată, iar eficacitatea programelor de training este măsurată riguros."
    ]
  },
  exp_monitoring: {
    critical: [
      "Măsurați periodic nivelul de engagement al angajaților prin chestionare dedicate.",
      "Asigurați-vă că managerii ascultă și acționează constructiv în baza feedback-ului primit.",
      "Oferiți canale sigure de comunicare (employee voice) pentru raportarea problemelor."
    ],
    improvement: [
      "Implementați un proces structurat de colectare a feedback-ului (ex: pulse surveys).",
      "Îmbunătățiți calitatea și transparența comunicării interne privind deciziile importante de business."
    ],
    strength: [
      "Există un sistem solid de monitorizare a experienței angajaților și o cultură deschisă bazată pe dialog."
    ]
  },
  wellbeing: {
    critical: [
      "Identificați și reduceți sursele majore de stres sau suprasolicitare din echipe.",
      "Monitorizați semnele de burnout sau epuizare în rândul angajaților."
    ],
    improvement: [
      "Dezvoltați inițiative simple de wellbeing (work-life balance, flexibilitate program).",
      "Instruiți managerii să identifice și să prevină riscurile psiho-sociale în echipe."
    ],
    strength: [
      "Wellbeing-ul este o prioritate strategică integrată în cultura de leadership a companiei."
    ]
  },
  ret_strategy: {
    critical: [
      "Începeți monitorizarea formală a fluctuației de personal (turnover) la nivel de companie.",
      "Stabiliți măsuri imediate pentru a reține angajații pe pozițiile critice cu risc mare de plecare.",
      "Implementați exit interviews structurate pentru a înțelege cauzele plecărilor."
    ],
    improvement: [
      "Analizați datele din exit interviews pentru a ajusta politicile de personal sau management.",
      "Definiți o strategie formală de retenție a talentelor bazată pe date și analiză de risc."
    ],
    strength: [
      "Fluctuația este monitorizată riguros, iar exit intelligence-ul este folosit pentru optimizarea retenției."
    ]
  },
  loyalty: {
    critical: [
      "Inițiați discuții de retenție (stay interviews) cu oamenii cheie înainte ca aceștia să decidă să plece.",
      "Dezvoltați inițiative specifice de fidelizare a performerilor."
    ],
    improvement: [
      "Creați pachete adaptate de loializare (retention packages) pentru rolurile greu de înlocuit.",
      "Asigurați-vă că angajații percep perspective reale de evoluție pe termen lung în organizație."
    ],
    strength: [
      "Loialitatea angajaților este susținută proactiv prin stay-dialogues și strategii avansate de carieră internă."
    ]
  },
  dig_infra_security: {
    critical: [
      "Implementați un sistem digital dedicat (HRIS/HR software) pentru eliminarea Excel-urilor dispersate.",
      "Centralizați fișierele de personal pentru a asigura un acces rapid și autorizat.",
      "Stabiliți politici stricte de securitate și control al accesului conform cerințelor GDPR."
    ],
    improvement: [
      "Digitalizați fluxul de gestionare a documentelor (ex: contracte, evaluări semnate electronic).",
      "Efectuați un audit de conformitate GDPR pe toate datele angajaților stocate în format fizic și digital."
    ],
    strength: [
      "Infrastructura digitală de personal este integrată, centralizată și conformă cu standardele de securitate GDPR."
    ]
  },
  dig_automation: {
    critical: [
      "Automatizați procesele administrative consumatoare de timp (ex: cereri de concediu, generare adeverințe).",
      "Simplificați workflow-urile de aprobare prin notificări și fluxuri de lucru digitale."
    ],
    improvement: [
      "Identificați și optimizați procesele repetitive HR care generează blocaje operaționale.",
      "Instruiți echipa HR pentru utilizarea instrumentelor de automatizare a sarcinilor de rutină."
    ],
    strength: [
      "Procesele administrative HR sunt automatizate, simplificate și optimizate continuu pentru eficiență."
    ]
  },
  dig_self_service_comm: {
    critical: [
      "Lansați un portal simplu de Employee Self-Service pentru a reduce cererile manuale de documente.",
      "Implementați instrumente digitale moderne pentru comunicarea internă (ex: Teams, Slack, portal intranet)."
    ],
    improvement: [
      "Introduceți o platformă digitală de e-learning (LMS) pentru instruirea accesibilă a angajaților.",
      "Oferiți managerilor acces securizat la datele de echipă prin dashboard-uri digitale dedicate."
    ],
    strength: [
      "Angajații utilizează activ portalul de self-service, iar comunicarea internă este modernă și integrată."
    ]
  },
  dig_analytics_readiness: {
    critical: [
      "Începeți colectarea digitală a indicatorilor cheie de HR (turnover, absenteism, costuri recrutare).",
      "Alocați un buget dedicat pentru digitalizarea și modernizarea funcției de HR."
    ],
    improvement: [
      "Construiți un dashboard live de HR reporting pentru a fundamenta deciziile de business pe date.",
      "Promovați o atitudine deschisă în echipa HR față de adoptarea tehnologiilor digitale prin traininguri."
    ],
    strength: [
      "Deciziile de personal sunt luate pe bază de HR analytics în timp real, iar echipa promovează inovația digitală."
    ]
  },
  com_doc_legal: {
    critical: [
      "Asigurați-vă că toate contractele de muncă (CIM) și actele adiționale sunt complete și semnate la timp.",
      "Actualizați fișele de post pentru toate rolurile active și folosiți-le ca instrument managerial real.",
      "Implementați un proces riguros de urmărire și aliniere la modificările legislației muncii."
    ],
    improvement: [
      "Standardizați fluxul de gestionare a modificărilor contractuale pentru a evita riscurile de întârziere.",
      "Obțineți suport juridic specializat (intern sau extern) pentru interpretarea spețelor complexe de HR."
    ],
    strength: [
      "Documentația de personal este completă, conformă și actualizată prompt conform legislației muncii."
    ]
  },
  com_relations: {
    critical: [
      "Documentați o procedură clară și legală pentru gestionarea abaterilor și cercetărilor disciplinare.",
      "Instruiți managerii operaționali cu privire la limitele legale în gestionarea conflictelor de muncă."
    ],
    improvement: [
      "Dezvoltați canale formale și sigure pentru depunerea reclamațiilor și sugestiilor de către angajați.",
      "Stabiliți un set clar de bune practici în relațiile de muncă pentru a asigura un climat de fairness."
    ],
    strength: [
      "Situațiile disciplinare și disputele sunt gestionate prin proceduri mature, transparente și conforme."
    ]
  },
  com_health_safety: {
    critical: [
      "Asigurați realizarea la timp a instruirilor și fișelor SSM (sănătate și securitate în muncă).",
      "Efectuați controalele periodice obligatorii de medicina muncii pentru toți angajații activi.",
      "Eliminați lacunele legislative în SSM pentru a evita amenzile severe din partea autorităților."
    ],
    improvement: [
      "Implementați un sistem digital de avertizare pentru termenele de re-instruire SSM și medicina muncii.",
      "Colaborați cu un furnizor specializat pentru evaluarea riscurilor de accidentare pe fiecare post."
    ],
    strength: [
      "Managementul SSM și medicina muncii sunt complet conforme, monitorizate preventiv și controlate digital."
    ]
  },
  com_audit_ethics: {
    critical: [
      "Efectuați un audit HR intern complet pentru a identifica riscurile legale nedeclarate.",
      "Dezvoltați planuri preventive concrete pentru reducerea riscurilor cheie de resurse umane."
    ],
    improvement: [
      "Implementați o procedură de raportare a abaterilor etice (whistleblowing) protejată și sigură.",
      "Măsurați periodic percepția angajaților cu privire la corectitudinea (fairness) deciziilor din companie."
    ],
    strength: [
      "Compania are un program activ de audit HR, gestionare proactivă a riscurilor și o cultură etică solidă."
    ]
  }
};

const MATURITY_LEVELS = [
  { min: 0, max: 20, level: "Reactiv", desc: "Procesele de HR sunt ad-hoc, slab formalizate și axate pe administrare și reacție la urgențe. Resursele umane nu sunt văzute ca un activ strategic." },
  { min: 21, max: 40, level: "Emergent", desc: "Organizația a început să definească roluri și reguli de bază în HR, dar aplicarea este inconsistentă, iar abordarea rămâne predominant operațională." },
  { min: 41, max: 60, level: "Structurat", desc: "Procesele HR principale sunt documentate și aplicate relativ consecvent. Există un set clar de proceduri, deși colaborarea strategică este limitată." },
  { min: 61, max: 80, level: "Avansat", desc: "Politici HR integrate, susținute de indicatori de performanță și bugete clar definite. Colaborarea dintre HR și management este activă și productivă." },
  { min: 81, max: 100, level: "Strategic", desc: "Cultură de tip 'people-first'. Funcția HR este partener de business, deciziile se bazează pe analiza datelor de personal (workforce analytics), iar procesele sunt optimizate continuu." }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      companyName,
      industry,
      companySize,
      ownershipType,
      respondentRole,
      responses, // Record<string, number> where key is question.id (e.g. "HRG1"), value is 1-5
      type // "governance" | "workforce"
    } = body;

    // 1. Validation
    if (!name || !email || !companyName || !industry || !companySize || !ownershipType || !respondentRole || !responses) {
      return new Response("Toate câmpurile sunt obligatorii.", { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response("Adresa de email nu este validă.", { status: 400 });
    }

    // Filter active sub-dimensions based on the type
    const activeSubDimensions = SUB_DIMENSIONS.filter(dim => {
      if (type === "governance") {
        return ["positioning", "processes", "strategy", "culture"].includes(dim.id);
      } else if (type === "workforce") {
        return ["planning", "competencies", "succession", "data"].includes(dim.id);
      } else if (type === "recruitment") {
        return ["rec_prep", "cand_attr", "sel_disc", "cand_exp"].includes(dim.id);
      } else if (type === "performance") {
        return ["perf_framework", "perf_dialogue", "rewards", "satisfaction"].includes(dim.id);
      } else if (type === "learning") {
        return ["lnd_strategy", "lnd_delivery", "lnd_culture", "lnd_career"].includes(dim.id);
      } else if (type === "experience") {
        return ["exp_monitoring", "wellbeing", "ret_strategy", "loyalty"].includes(dim.id);
      } else if (type === "digitalization") {
        return ["dig_infra_security", "dig_automation", "dig_self_service_comm", "dig_analytics_readiness"].includes(dim.id);
      } else if (type === "compliance") {
        return ["com_doc_legal", "com_relations", "com_health_safety", "com_audit_ethics"].includes(dim.id);
      }
      return true; // fallback to all if type is unspecified
    });

    const dbSource = 
      type === "workforce" ? "evaluare-planificare-hr" : 
      type === "recruitment" ? "evaluare-recrutare-hr" : 
      type === "performance" ? "evaluare-performanta-hr" : 
      type === "learning" ? "evaluare-dezvoltare-hr" : 
      type === "experience" ? "evaluare-experienta-hr" : 
      type === "digitalization" ? "evaluare-digitalizare-hr" : 
      type === "compliance" ? "evaluare-compliance-hr" : 
      "evaluare-maturitate-hr";

    // 2. Compute Scoring per Sub-Dimension
    const subDimScores: Record<string, number> = {};
    let totalRaw = 0;
    let totalMax = 0;

    activeSubDimensions.forEach((dim) => {
      let dimRaw = 0;
      let dimMax = 0;

      dim.qIds.forEach((qId) => {
        const val = Number(responses[qId]);
        if (!isNaN(val)) {
          dimRaw += val;
          dimMax += 5;
        }
      });

      const percentage = dimMax > 0 ? Math.round((dimRaw / dimMax) * 100) : 0;
      subDimScores[dim.id] = percentage;
      totalRaw += dimRaw;
      totalMax += dimMax;
    });

    // Calculate overall score across the selected questions
    const overallScore = totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;

    // Determine overall maturity level
    const levelObj = MATURITY_LEVELS.find(l => overallScore >= l.min && overallScore <= l.max) || MATURITY_LEVELS[0];

    // 3. Generate Recommendations per Sub-Dimension
    const recommendations: { moduleId: string; moduleName: string; score: number; status: "critical" | "improvement" | "strength"; items: string[] }[] = [];
    const strongestAreas: string[] = [];
    const weakestAreas: string[] = [];

    activeSubDimensions.forEach((dim) => {
      const score = subDimScores[dim.id];
      let status: "critical" | "improvement" | "strength" = "improvement";
      let items: string[] = [];

      const configRecs = PREDEFINED_RECOMMENDATIONS[dim.id as keyof typeof PREDEFINED_RECOMMENDATIONS];

      if (score < 40) {
        status = "critical";
        items = configRecs?.critical || [];
        weakestAreas.push(`${dim.name} (Scor: ${score}%) - Vulnerabilitate critică`);
      } else if (score >= 41 && score <= 79) {
        status = "improvement";
        items = configRecs?.improvement || [];
        if (score < 60) {
          weakestAreas.push(`${dim.name} (Scor: ${score}%) - Necesită atenție`);
        }
      } else {
        status = "strength";
        items = configRecs?.strength || [];
        strongestAreas.push(`${dim.name} (Scor: ${score}%) - Punct forte`);
      }

      recommendations.push({
        moduleId: dim.id,
        moduleName: dim.name,
        score,
        status,
        items
      });
    });

    // Fallbacks if lists are empty
    if (strongestAreas.length === 0) {
      strongestAreas.push("Nu s-au detectat puncte forte consolidate (scor > 80%). Concentrați-vă pe ridicarea nivelului general.");
    }
    if (weakestAreas.length === 0) {
      weakestAreas.push("Felicitări! Nu aveți vulnerabilități critice (scor < 40%). Continuați optimizarea proceselor existente.");
    }

    // 4. Generate 90-Day action roadmap based on weakest sub-dimensions
    const sortedWeakestDimensions = [...recommendations].sort((a, b) => a.score - b.score);
    const roadmap = [
      {
        phase: "Zilele 1–30: Urgențe și Stabilizare",
        title: `Plan de acțiune imediată pentru ${sortedWeakestDimensions[0]?.moduleName || "HR"}`,
        actions: sortedWeakestDimensions[0]?.status === "critical"
          ? (sortedWeakestDimensions[0]?.items.slice(0, 2) || [])
          : ["Definirea priorităților imediate și stabilirea rolurilor de bază.", "Alinierea managementului pe obiectivele de personal."]
      },
      {
        phase: "Zilele 31–60: Standardizare și Proceduri",
        title: `Implementare procese cheie pentru ${sortedWeakestDimensions[1]?.moduleName || "HR"}`,
        actions: sortedWeakestDimensions[1]
          ? (sortedWeakestDimensions[1]?.items.slice(0, 2) || [])
          : ["Documentarea proceselor esențiale scrise.", "Comunicarea noilor reguli de HR către toți angajații."]
      },
      {
        phase: "Zilele 61–90: Monitorizare și Optimizare",
        title: "Evaluare și KPIs de personal",
        actions: [
          "Măsurarea feedback-ului din partea angajaților după implementarea primelor schimbări.",
          "Analiza trimestrială a indicatorilor stabiliți pentru a evalua progresul."
        ]
      }
    ];

    const hrScoreReport = {
      score: overallScore,
      level: levelObj.level,
      description: levelObj.desc,
      moduleScores: subDimScores,
      recommendations,
      strongestAreas,
      weakestAreas,
      roadmap
    };

    // 5. Save Lead in Database
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        companyName,
        industry,
        companySize,
        ownershipType,
        respondentRole,
        source: dbSource,
        score: overallScore,
        level: levelObj.level,
        hrAnswers: responses,
        hrScoreReport: hrScoreReport as any
      }
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      ...hrScoreReport
    });
  } catch (error) {
    console.error("[EVALUARE_HR_POST_ERROR]", error);
    return new Response("A apărut o eroare la salvarea evaluării.", { status: 500 });
  }
}
