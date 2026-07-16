# GHID DE UTILIZARE ȘI OPERARE - VREAU DIGITALIZARE

Acest manual de utilizare a fost conceput pentru a vă ghida pas cu pas prin toate funcționalitățile platformei "VreauDigitalizare". Documentul este împărțit în două secțiuni principale: interacțiunea vizitatorilor cu portalul public (Frontend) și operarea platformei de către personalul autorizat (Backend/Admin Dashboard).

---

# SECȚIUNEA 1: EXPERIENȚA VIZITATORULUI (FRONTEND)

Interfața publică a platformei a fost creată pentru a fi intuitivă, orientată către acțiune și optimizată pentru conversie (transformarea vizitatorilor în potențiali clienți / lead-uri).

## 1.1. Prima interacțiune și Pagina Principală (Homepage)
La accesarea portalului web, vizitatorul este întâmpinat de Pagina Principală.
- **Header și Navigare:** În zona superioară există un meniu persistent care conține link-uri rapide către „Despre Noi”, „Servicii”, „Contact”, „Chestionar” și secțiunea de „Autentificare”. Meniul se adaptează automat pe dispozitivele mobile sub forma unui meniu "hamburger".
- **Secțiunea Hero:** O zonă vizuală de mare impact, unde animațiile WebGL (fluidul de fundal) reacționează la mișcarea cursorului, subliniind caracterul modern și inovator al agenției. Aici se află butonul principal de Call-to-Action (ex: "Start Assessment" sau "Contactează-ne").
- **Social Proof:** Sub zona principală sunt afișate rezultatele și logo-urile companiilor partenere, având scopul de a genera încredere.

## 1.2. Utilizarea Chestionarului Interactiv (Lead Magnet)
Scopul principal al platformei pentru un vizitator nou este evaluarea propriei companii prin intermediul chestionarului de maturitate digitală.
1. Navigarea se face apăsând butonul „Începe Evaluarea” / „Start Assessment”.
2. Vizitatorului i se vor prezenta întrebări, una câte una (într-o interfață curată, fără elemente de distragere).
3. Răspunsurile se selectează cu un simplu click. Bara de progres din partea superioară indică vizual stadiul completării (ex: 2/5).
4. **Pasul final:** Pentru a primi rezultatele (raportul de audit), utilizatorul trebuie să furnizeze detalii de contact: Nume Complet, Numele Companiei și Adresa de Email.
5. După apăsarea butonului "Trimite", datele sunt transmise securizat, iar utilizatorul primește un mesaj de mulțumire, fiind instruit să verifice căsuța de email.

## 1.3. Cum se programează o întâlnire (Sistemul de Booking)
În cazul în care utilizatorul dorește să intre direct în contact cu echipa:
1. Accesează pagina de **Contact** sau apasă pe un buton de tip **„Programează un apel”**.
2. **Selectarea Datei:** Un calendar lunar apare pe ecran. Zilele indisponibile sau din trecut sunt blocate și au culoarea gri. Utilizatorul dă click pe o zi marcată cu culoare închisă (disponibilă).
3. **Selectarea Orei:** Odată ziua aleasă, pe ecran apare o listă cu intervalele orare libere. Odată ce se apasă pe un interval orar (ex: 14:00), acesta se evidențiază.
4. **Completarea Datelor:** Utilizatorul apasă "Continuă", iar platforma cere datele minime necesare: Nume, Email, Telefon și un scurt mesaj despre scopul discuției.
5. **Confirmarea:** Apăsând "Confirmă Programarea", pe ecran se afișează un sumar al întâlnirii, iar sistemul blochează automat acel interval orar, pentru a preveni alte programări simultane.

## 1.4. Interacțiunea prin Widget-ul de Chat
Pe orice pagină a platformei, în colțul din dreapta-jos, vizitatorii au la dispoziție o pictogramă de chat (un balon de dialog).
- La apăsarea acesteia, se deschide o fereastră prietenoasă de contact rapid.
- Completarea câmpurilor trimite direct un mesaj către adresa oficială de suport a agenției. După trimitere, fereastra se închide automat cu un efect vizual de succes.

---

# SECȚIUNEA 2: PANOUL DE ADMINISTRARE (DASHBOARD)

Această secțiune se adresează exclusiv echipei "VreauDigitalizare" (administratori, consultanți, departamentul de vânzări). Accesul se face securizat, pe bază de rol.

## 2.1. Conectarea la Panoul de Administrare
1. Se accesează ruta `/admin` sau se dă click pe "Autentificare" din meniul principal.
2. În pagina de login, se introduc credențialele de administrator sau se folosește contul de Google al agenției.
3. Dacă sistemul detectează lipsa rolului de "ADMIN", utilizatorul este respins (sau redirecționat înapoi spre pagina principală).
4. Odată autentificat, se deschide Dashboard-ul, care folosește tema "Dark Enterprise" (un design întunecat pentru lizibilitate maximă în utilizarea îndelungată).

## 2.2. Vizualizarea Indicatorilor Cheie (Dashboard Home)
Ecranul de start prezintă sănătatea generală a platformei:
- Numărul total de Lead-uri intrate în platformă în luna curentă.
- Numărul de cereri de programare (Appointments) în așteptare.
- Grafice cu tendințele de conversie din ultimele 30 de zile.

## 2.3. Managementul Clienților (Fluxul de Leads)
Acesta este spațiul unde se concretizează vânzările.
1. Navigați în meniul din stânga la rubrica **„Leads”**.
2. **Listarea și Filtrarea:** Toți prospecții sunt listați sub forma unui tabel detaliat (Data Table). Fiecare prospect are afișat: Data înregistrării, Nume, Email, Scorul de Maturitate și Status-ul curent.
3. Puteți căuta un client după nume sau email folosind bara de căutare din dreapta sus.
4. **Pagina de Detaliu a Prospectului:** Făcând click pe numele unui lead, se deschide fișa acestuia. Aici, consultantul de vânzări are acces la tot istoricul:
   - *Ce răspunsuri a dat la chestionar.* (Analiza acestor răspunsuri este esențială înainte de primul apel telefonic).
   - *Scorul exact de digitalizare.*
   - *Notițe interne.* Administratorul poate adăuga observații: „Am apelat clientul pe data X. Urmează să trimitem oferta Y.”
5. **Schimbarea Statusului:** În partea de sus a paginii lead-ului, există un meniu derulant. După interacțiunea cu prospectul, schimbați starea sa din `NEW` în `CONTACTED` (contactat), `QUALIFIED` (dacă interacțiunea a fost un succes) sau `LOST` (dacă afacerea a picat).

## 2.4. Gestionarea Programărilor și a Calendarului
Calendarul este centrul operațiunilor de consultanță.
1. Navigați la rubrica **„Programări” (Appointments)**.
2. **Acceptarea sau Respingerea:** Aici apar cererile generate de vizitatori (descris la punctul 1.3). Fiecare cerere are statusul `PENDING` (În așteptare). Dacă programul permite, apăsați pe bifa verde (`Approve`). Dacă nu, apăsați pe cruciulița roșie (`Decline`), iar intervalul va deveni din nou disponibil public.
3. **Setarea Disponibilității (Availability):** Apăsați pe tab-ul *Setări Calendar*. Aici vă definiți orarul de lucru. Introduceți zilele din săptămână și orele între care doriți să primiți programări (ex: 10:00 - 15:00). Orice modificare aici este reflectată în timp real în calendarul de pe site.

## 2.5. Crearea de Conținut (Sistemul de Blog / Articole)
Pentru atragerea traficului organic (SEO), platforma integrează un manager de conținut intern.
1. Navigați la rubrica **„Blog” / „Conținut”**.
2. Apăsați butonul de creare a unui articol nou.
3. **Utilizarea Editorului Text (Tiptap):** Editorul funcționează similar cu editoarele cunoscute (Notion, Google Docs). Evidențiați orice text pentru a-l formata ca *Titlu (H2, H3)*, *Bold*, *Italic*, sau pentru a-l transforma într-un link.
4. **Setări Articol:** Adăugați o imagine reprezentativă (Cover Image), o scurtă descriere pentru SEO, titlul principal și alegeți statusul (`Draft` - Ciornă, sau `Published` - Publicat).
5. Odată publicat, articolul devine vizibil automat în secțiunea de Blog publică a site-ului.

---
*Urmând acești pași, echipa administrativă deține controlul absolut asupra fluxului operațional, iar clienții se bucură de o experiență digitală de nivel Enterprise, perfect integrată.*
