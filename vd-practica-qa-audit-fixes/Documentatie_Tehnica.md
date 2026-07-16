# CAPITOLUL 1: INTRODUCERE ȘI PREZENTAREA PROIECTULUI

## 1.1. Contextul și Obiectivul Proiectului
Proiectul „VreauDigitalizare” a luat naștere din necesitatea stringentă a companiilor mici și mijlocii (IMM) din România de a adopta soluții de digitalizare. Într-o piață din ce în ce mai competitivă, lipsa digitalizării duce la pierderi de timp, ineficiență în gestiunea resurselor și o experiență deficitară a clienților.

Obiectivul principal al acestei platforme este de a oferi un instrument B2B integrat, cu un design modern și performant, care să îndeplinească următoarele roluri:
1. **Punct de Informare și Educare:** Prezentarea serviciilor de digitalizare într-o manieră accesibilă.
2. **Instrument de Calificare (Lead Generation):** Implementarea unui audit digital interactiv care să colecteze date despre nevoile clienților și să genereze automat un scor de maturitate.
3. **Sistem de Programare (Booking):** Eliminarea schimbului nesfârșit de emailuri pentru stabilirea unei întâlniri. Platforma integrează un calendar dinamic unde utilizatorii își pot rezerva sloturi orare, sincronizate cu disponibilitatea echipei.
4. **Panou de Administrare (Dashboard):** Oferirea unui spațiu de lucru privat, protejat, unde echipa internă poate gestiona cererile (lead-urile), programările și conținutul platformei.

## 1.2. Arhitectura Generală a Sistemului
Sistemul este dezvoltat respectând paradigma "Monolithic Full-Stack" modernă. Prin utilizarea framework-ului Next.js 14, frontend-ul (interfața utilizatorului) și backend-ul (logica de server, rutele API) coexistă în același depozit de cod (monorepo logic). 

Acest model arhitectural oferă numeroase avantaje:
- **Latență redusă:** Server Components pot interoga direct baza de date, fără a mai face call-uri HTTP către un API REST separat.
- **Securitate sporită:** Cheile de acces la serviciile externe (ex: baza de date, serviciul de email) rămân exclusiv pe server și nu sunt expuse în codul trimis browser-ului.
- **Dezvoltare agilă:** Tipurile TypeScript sunt partajate automat între frontend și backend. Modelul de date definit în Prisma este imediat disponibil în componentele React.

# CAPITOLUL 2: STIVA TEHNOLOGICĂ (TECH STACK)

Alegerea tehnologiilor s-a făcut având în vedere performanța, mentenabilitatea și scalabilitatea aplicației. 

## 2.1. Framework-ul Principal: Next.js 14
Next.js a fost ales datorită suportului nativ pentru **App Router** și **React Server Components (RSC)**. Această abordare schimbă modul în care paginile web sunt construite:
- **Server-Side Rendering (SSR):** Anumite pagini dinamice sunt asamblate pe server înainte de a fi trimise către client.
- **Static Site Generation (SSG):** Paginile publice, precum politica de confidențialitate sau termenii și condițiile, sunt pre-compilate la momentul de build, oferind timpi de încărcare aproape instantanei (sub 50ms) și indexare perfectă în motoarele de căutare (SEO).

## 2.2. Limbajul de Programare: TypeScript
Pentru a asigura calitatea codului și a preveni erorile de tip "runtime", s-a folosit TypeScript pe tot parcursul proiectului. Astfel, fiecare variabilă, funcție sau răspuns din baza de date are un tip bine definit, ajutând IDE-ul să ofere auto-completare și să semnaleze erori chiar înainte de rularea aplicației.

## 2.3. Stilizare: Tailwind CSS și Radix UI
Aplicația implementează tema vizuală "Obsidian & Rose".
- **Tailwind CSS:** Oferă clase utilitare (`bg-black`, `text-white`, `flex`, `p-4`) care permit construirea de interfețe complexe direct din codul HTML/JSX. S-a folosit un sistem extins de variabile CSS pentru a gestiona culorile brandului.
- **Radix UI (prin shadcn/ui):** Componentele interactive (precum ferestrele modale, meniurile dropdown, butoanele de selecție) sunt construite pe primitive Radix UI, care asigură accesibilitate completă (navigare din tastatură, suport pentru screen readere) și comportament corect conform standardelor WAI-ARIA.

## 2.4. Baza de Date și ORM: PostgreSQL & Prisma
- **PostgreSQL:** O bază de date relațională extrem de puternică și fiabilă, ideală pentru relațiile complexe dintre Utilizatori, Lead-uri, Răspunsuri la Chestionar și Programări.
- **Prisma ORM:** Un instrument care facilitează comunicarea cu baza de date. În loc să scriem query-uri SQL brute (ex: `SELECT * FROM users`), Prisma ne permite să folosim metode TypeScript sigure (ex: `prisma.user.findMany()`).

## 2.5. Autentificare: NextAuth.js
Securitatea accesului în panoul de administrare este garantată de NextAuth.js, care gestionează sesiunile utilizatorilor, criptează datele și facilitează integrarea cu provideri externi (cum ar fi conectarea rapidă cu Google sau GitHub).

# CAPITOLUL 3: STRUCTURA BAZEI DE DATE

Schema bazei de date (definită în `schema.prisma`) reprezintă "scheletul" informațional al aplicației.

## 3.1. Modele pentru Autentificare
- **User:** Conține informații despre conturile active. Câmpul `role` determină nivelul de acces (un utilizator poate fi vizitator obișnuit `USER` sau administrator `ADMIN`).
- **Account / Session:** Modele tehnice necesare NextAuth pentru păstrarea sesiunilor active.

## 3.2. Modele pentru Achiziția de Clienți (Lead Generation)
- **Lead:** Entitatea centrală în vânzări. Stochează datele de contact (nume, email, telefon), statusul curent (ex: `NOU`, `CONTACTAT`, `CALIFICAT`, `PIERDUT`) și un scor general de maturitate (un număr care indică cât de pregătită este compania pentru digitalizare).
- **Questionnaire & Question:** Structura logică a auditului. O întrebare poate fi cu alegere simplă sau multiplă.
- **Response & ResponseAnswer:** Legătura dintre un Lead și răspunsurile oferite la chestionar. Pe baza acestora se calculează scorul final.

## 3.3. Modele pentru Programări (Booking System)
- **Availability:** Programul de lucru standard (ex: de luni până vineri, 09:00 - 17:00).
- **BlockedDate:** Excepțiile de la program (concedii, sărbători legale).
- **Appointment:** Reține detaliile unei întâlniri confirmate (data de început, data de sfârșit, statusul aprobării, link-ul de conectare video și notele clientului).

# CAPITOLUL 4: MODULE FUNCȚIONALE ȘI LOGICĂ DE BUSINESS

## 4.1. Generarea Dinamică a Sloturilor de Timp
Unul dintre cele mai complexe module este algoritmul de generare a orelor disponibile pentru programare (`slot-generator.ts`). 
Când un utilizator vizitează pagina de contact și selectează o zi, sistemul:
1. Interoghează orarul de lucru (`Availability`) pentru acea zi a săptămânii.
2. Verifică dacă ziua nu este cumva adăugată în `BlockedDate`.
3. Extrage toate programările deja confirmate (`Appointments`) din acea zi.
4. Generează o listă de "sloturi" (ex: din 30 în 30 de minute) scăzând timpii morți, pauzele de masă și programările existente. Astfel, se evită fenomenul de "double-booking" (suprapunere).

## 4.2. Fluxul de Chestionare și Scorizare
Chestionarul a fost dezvoltat ca o aplicație de tip "Single Page Application" în cadrul unei rute Client-Side. Utilizatorul navighează prin pași folosind animații fluide (Framer Motion). La pasul final, răspunsurile sunt agregate, trimise către o rută de API sigură (`/api/leads`), unde pe server se execută logica de calculare a punctajului. Baza de date este actualizată, iar un email de confirmare poate fi declanșat prin intermediul serviciului Resend.

## 4.3. Sistemul de Rute și Middleware
Securizarea panoului de administrare `/admin` se realizează printr-un Middleware special (Next.js Edge Middleware). Acesta se execută înainte de randarea oricărei pagini. Dacă vizitatorul încearcă să acceseze `/admin/leads` fără o sesiune validă cu rol de `ADMIN`, Middleware-ul îl interceptează și îl trimite automat către pagina de autentificare (`/login`).

# CAPITOLUL 5: DEPLOYMENT ȘI MEDIUL DE PRODUCȚIE

## 5.1. Soluția de Hosting (Vercel)
Aplicația este optimizată pentru a fi lansată pe Vercel, o platformă de hosting serverless. În momentul în care codul este urcat pe platforma GitHub, Vercel preia noul cod, instalează dependențele (folosind un manager de pachete setat la modul "legacy-peer-deps" pentru a evita conflictele), compilează paginile statice și pune aplicația online în doar câteva minute.

## 5.2. Gestionarea Variabilelor de Mediu
Securitatea aplicației impune separarea clară a credențialelor de codul sursă. Pentru rularea în producție, platforma are nevoie de:
- `DATABASE_URL`: Conexiunea la serverul PostgreSQL (ex: pe platforme cloud ca Neon sau Supabase).
- `AUTH_SECRET`: Un șir de caractere aleator folosit pentru a cripta sesiunile utilizatorilor.
- `NEXT_PUBLIC_APP_URL`: Adresa de bază a site-ului.

Toate aceste variabile sunt validate la compilare prin intermediul bibliotecii `@t3-oss/env-nextjs`, ceea ce garantează că aplicația nu va rula niciodată cu o configurație eronată.

---
*Acest document tehnic acoperă deciziile inginerești din spatele platformei, asigurând un mediu fiabil, scalabil și securizat.*
