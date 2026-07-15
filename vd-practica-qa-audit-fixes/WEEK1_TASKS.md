# WEEK 1 — Foundation & Stabilization

**Objective**: Setup infrastructure, validate core systems, establish patterns

**Timeline**: Monday - Friday (5 days)

---

## TEAM 1 — Core Platform & Admin Foundation

**Total Tasks**: 5  
**Assignees**: 4 developers (rotate lead daily)

### TASK 1.1.1 — Remove Demo Content & Update Branding

**Assigned to**: Dev 1  
**Duration**: 1 day

**Context**:
The template includes demo content and branding from the original template that must be removed before real development.

**Scope**:
- Remove `/content` folder (demo markdown files)
- Remove demo blog posts and guides
- Update app metadata in `next.config.js`
- Update `config/site.ts` with vreaudigitalizare branding
- Update `config/landing.ts` menu structure
- Remove Stripe references from all config files
- Update favicon and OpenGraph images to placeholder vd-practica assets
- Update page titles and descriptions for vreaudigitalizare

**Out of Scope**:
- Don't touch authentication
- Don't touch database schemas
- Don't create new pages

**Acceptance Criteria**:
- [ ] No demo content remains
- [ ] Site config references vreaudigitalizare.eu
- [ ] TypeScript strict mode - no errors
- [ ] Build passes
- [ ] PR ≤ 500 lines

**AI Instructions**:
Keep focused on removing/replacing content. Don't refactor architecture.

---

### TASK 1.1.2 — Validate & Document Environment Setup

**Assigned to**: Dev 2  
**Duration**: 1 day

**Context**:
Ensure all development team members understand how to setup local environment correctly.

**Scope**:
- Create `SETUP.md` with step-by-step local setup instructions
- Document Docker setup (what each container does)
- Document environment variables required for development
- Create `.env.example` if not complete
- Validate Prisma connection to PostgreSQL
- Document how to seed initial data
- Create troubleshooting section
- Test all commands on clean environment

**Out of Scope**:
- Don't modify actual configurations
- Don't change any code

**Acceptance Criteria**:
- [ ] SETUP.md is clear and complete
- [ ] All devs can follow and setup locally
- [ ] Prisma connection works
- [ ] No missing steps
- [ ] Troubleshooting section covers common issues

**AI Instructions**:
Document the existing setup. Don't create new functionality.

---

### TASK 1.2.1 — Validate NextAuth.js Configuration

**Assigned to**: Dev 3  
**Duration**: 1 day

**Context**:
Auth system is foundation for admin panel. Must be verified and tested.

**Scope**:
- Test login page works
- Test registration page works
- Verify JWT token generation
- Verify session persistence
- Test logout flow
- Verify middleware protects `/admin` routes
- Create simple test for auth flow
- Document auth flow in code
- Verify error handling (wrong password, non-existent user)

**Out of Scope**:
- Don't add 2FA (future phase)
- Don't modify OAuth providers yet
- Don't add new auth methods

**Acceptance Criteria**:
- [ ] Login/register work
- [ ] JWT tokens generated correctly
- [ ] Session persists
- [ ] Middleware protects admin routes
- [ ] Logout clears session
- [ ] Error messages are clear
- [ ] Tests pass
- [ ] Build passes

**AI Instructions**:
Test and document existing auth. Don't create new features.

---

### TASK 1.3.1 — Create Admin Sidebar Layout

**Assigned to**: Dev 4  
**Duration**: 1.5 days

**Context**:
Admin panel needs navigation structure for all future modules.

**Scope**:
- Create sidebar component with collapsible menu
- Add navigation items for:
  - Dashboard
  - Questionnaires
  - Blog
  - CMS Pages
  - Leads
  - Settings
  - Audit Logs
- Make responsive (collapse on mobile)
- Add active state styling
- Use ShadCN UI components only
- Create admin layout that wraps routes

**Out of Scope**:
- Don't implement actual pages yet
- Don't implement functionality behind links
- Don't add search/advanced navigation

**Acceptance Criteria**:
- [ ] Sidebar renders without errors
- [ ] Navigation items present and correct
- [ ] Active state works
- [ ] Responsive (desktop + mobile)
- [ ] Uses ShadCN components
- [ ] TypeScript strict - no errors
- [ ] Build passes
- [ ] PR ≤ 500 lines

**AI Instructions**:
Create layout component. Use existing UI patterns.

---

### TASK 1.4.1 — Create AuditLog Prisma Model

**Assigned to**: Dev 1 (after 1.1.1)  
**Duration**: 0.5 day

**Context**:
Audit logging is critical for security and compliance. Must be part of foundation.

**Scope**:
- Create `AuditLog` Prisma model with:
  - id (primary key)
  - userId (who did it)
  - action (what was done)
  - resource (what resource)
  - resourceId (id of resource)
  - changes (JSON for before/after)
  - timestamps (createdAt)
  - ipAddress (optional)
- Create migration
- Add indexes on userId, action, createdAt
- Seed sample audit logs

**Out of Scope**:
- Don't create audit service yet
- Don't create UI to view logs yet
- Don't implement automatic logging

**Acceptance Criteria**:
- [ ] Model defined correctly
- [ ] Migration creates table
- [ ] Indexes present
- [ ] Seed works
- [ ] TypeScript strict - no errors
- [ ] Build passes

**AI Instructions**:
Create just the Prisma model. Nothing else.

---

## TEAM 2 — Website Public, CMS & Blog

**Total Tasks**: 4  
**Assignees**: 4 developers

### TASK 2.1.1 — Create Homepage Hero Section (Static)

**Assigned to**: Dev 1  
**Duration**: 1 day

**Context**:
Homepage is the entry point for lead generation. Start with static hero section.

**Scope**:
- Create `/app/(public)/page.tsx` with hero section
- Include:
  - Background image/gradient
  - Headline (e.g., "Digitalizare pentru Compania Ta")
  - Subheadline
  - Primary CTA button (links to contact form)
  - Secondary CTA button
- Make fully responsive
- Use TailwindCSS for styling
- Use ShadCN Button component
- Add proper SEO meta tags in layout

**Out of Scope**:
- Don't make it CMS-managed yet
- Don't create contact form
- Don't add animations

**Acceptance Criteria**:
- [ ] Hero section renders
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Uses ShadCN components only
- [ ] TypeScript strict - no errors
- [ ] Build passes
- [ ] Screenshot included
- [ ] PR ≤ 500 lines

**AI Instructions**:
Create static component. Keep it simple. Don't refactor.

---

### TASK 2.1.2 — Create Homepage Services Section (Static)

**Assigned to**: Dev 2  
**Duration**: 1 day

**Context**:
Services section shows what vd-practica offers. Static for now.

**Scope**:
- Create reusable service card component
- Add section showing 4-6 services:
  - Service name
  - Icon
  - Brief description
  - Link/CTA
- Use grid layout (responsive)
- Make cards visually distinct
- Use existing icons from Lucide

**Out of Scope**:
- Don't make it CMS-managed
- Don't add detail pages
- Don't add filtering

**Acceptance Criteria**:
- [ ] Section renders
- [ ] Cards visible and readable
- [ ] Responsive layout
- [ ] Uses ShadCN components
- [ ] TypeScript strict
- [ ] Build passes
- [ ] Screenshot included

**AI Instructions**:
Create reusable card component. Keep simple.

---

### TASK 2.2.1 — Create Page & Section Prisma Models

**Assigned to**: Dev 3  
**Duration**: 1 day

**Context**:
CMS needs data models to store pages and sections.

**Scope**:
- Create `Page` model:
  - id, slug, title, description
  - status (draft/published)
  - content (JSON)
  - timestamps
- Create `Section` model:
  - id, pageId, title, type
  - content (JSON)
  - order
  - timestamps
- Create migration
- Add relationships (Page → Sections)
- Add indexes on slug, status

**Out of Scope**:
- Don't create UI yet
- Don't create API endpoints
- Don't implement publishing logic

**Acceptance Criteria**:
- [ ] Models defined
- [ ] Migration works
- [ ] Relationships correct
- [ ] Indexes present
- [ ] Seed sample data
- [ ] Build passes

**AI Instructions**:
Create just Prisma models. Follow schema patterns.

---

### TASK 2.3.1 — Create Blog Models (Article, Category, Tag)

**Assigned to**: Dev 4  
**Duration**: 1.5 days

**Context**:
Blog needs data structure for articles, categories, and tags.

**Scope**:
- Create `Article` model:
  - id, slug, title, description, content
  - status (draft/published)
  - authorId, publishedAt
  - featured image URL
  - timestamps
- Create `Category` model:
  - id, slug, name
- Create `Tag` model:
  - id, slug, name
- Create relationships (Article → Category, Article → Tag)
- Create migration
- Add indexes
- Seed sample data

**Out of Scope**:
- Don't create UI
- Don't create API
- Don't create editor

**Acceptance Criteria**:
- [ ] Models defined
- [ ] Relationships correct
- [ ] Migration works
- [ ] Indexes on slug, status
- [ ] Sample data seeded
- [ ] Build passes

**AI Instructions**:
Create Prisma models only. Follow existing patterns.

---

## TEAM 3 — Questionnaire Engine, AI & Leads

**Total Tasks**: 3  
**Assignees**: 4 developers (1 on each, 1 as backup)

### TASK 3.1.1 — Create Questionnaire Core Models

**Assigned to**: Dev 1  
**Duration**: 1 day

**Context**:
Questionnaire is core business logic. Models must be robust and support versioning.

**Scope**:
- Create `Questionnaire` model:
  - id, slug, title, description
  - status (draft/published)
  - category
  - timestamps
- Create `QuestionnaireVersion` model:
  - id, questionnaireId, versionNumber
  - createdAt
  - note/changeLog
- Create relationship: Questionnaire → QuestionnaireVersion
- Create migration
- Add indexes

**Out of Scope**:
- Don't create questions yet
- Don't create responses
- Don't implement versioning logic

**Acceptance Criteria**:
- [ ] Models defined correctly
- [ ] Relationship is correct
- [ ] Migration works
- [ ] Indexes present
- [ ] Can query latest version
- [ ] Build passes

**AI Instructions**:
Create models for questionnaire core only.

---

### TASK 3.1.2 — Create Question & Response Models

**Assigned to**: Dev 2  
**Duration**: 1 day

**Context**:
Questions and responses form the questionnaire structure.

**Scope**:
- Create `Question` model:
  - id, versionId, type
  - text, order
  - required, timestamps
- Create `QuestionOption` model:
  - id, questionId
  - text, value, order
- Create `Response` model:
  - id, questionnaireId, versionId
  - userId (if logged in) or email
  - status (in_progress/completed)
  - timestamps
- Create `ResponseAnswer` model:
  - id, responseId, questionId
  - answer (JSON for flexibility)
- Create migrations
- Add indexes

**Out of Scope**:
- Don't create scoring
- Don't create validation
- Don't create scoring

**Acceptance Criteria**:
- [ ] All models defined
- [ ] Relationships correct
- [ ] Migration works
- [ ] Indexes on foreign keys
- [ ] Sample data seeded
- [ ] Build passes

**AI Instructions**:
Create just the models. Follow existing patterns.

---

### TASK 3.2.1 — Create Lead Model & Lead Capture

**Assigned to**: Dev 3  
**Duration**: 1 day

**Context**:
Lead capture is primary business goal. Must be part of foundation.

**Scope**:
- Create `Lead` model:
  - id, email, phone, name
  - company (optional)
  - source (form/questionnaire/blog)
  - sourceId (form_id, questionnaire_id)
  - status (new/contacted/qualified/lost)
  - notes (JSON)
  - timestamps
- Create migration
- Create simple function to capture leads
- Add indexes on email, status, createdAt

**Out of Scope**:
- Don't create UI yet
- Don't create email notifications
- Don't create CRM integration

**Acceptance Criteria**:
- [ ] Model defined
- [ ] Migration works
- [ ] Can create leads
- [ ] Indexes present
- [ ] Unique email enforcement
- [ ] Build passes

**AI Instructions**:
Create model and basic lead capture function.

---

### TASK 3.3.1 — Create Scoring & ScoreResult Models

**Assigned to**: Dev 4  
**Duration**: 1 day

**Context**:
Scoring determines maturity assessment results.

**Scope**:
- Create `ScoreResult` model:
  - id, responseId
  - totalScore, maxScore
  - category (JSON for category scores)
  - recommendations (JSON)
  - timestamps
- Create migration
- Create function to calculate basic score
- Add indexes

**Out of Scope**:
- Don't implement complex scoring logic
- Don't implement recommendations algorithm
- Don't create result page

**Acceptance Criteria**:
- [ ] Model defined
- [ ] Migration works
- [ ] Can calculate basic score
- [ ] Recommendations stored
- [ ] Build passes

**AI Instructions**:
Create model and basic scoring function only.

---

## 📊 Task Distribution

| Team | Task Count | Total Dev-Days | Daily Avg |
|------|-----------|----------------|-----------|
| TEAM 1 | 5 | 5.5 | 1.37 |
| TEAM 2 | 4 | 4.5 | 1.12 |
| TEAM 3 | 3 | 3.5 | 0.87 |
| **TOTAL** | **12** | **13.5** | **~4.5/day** |

---

## 🎯 Success Metrics for WEEK 1

✅ **All tasks completed and merged to develop**  
✅ **No security issues or secrets exposed**  
✅ **All PRs have 2+ approvals**  
✅ **CI pipeline passes for all commits**  
✅ **Code review checklist 100% compliant**  
✅ **No unrelated refactoring**  
✅ **All PRs < 500 lines modified**  
✅ **Team understands development process**

---

## 📝 Next Week Preview (WEEK 2)

After WEEK 1, we'll have:
- ✓ Clean, branded codebase
- ✓ Auth validated
- ✓ Admin layout ready
- ✓ All core Prisma models
- ✓ Homepage structure
- ✓ Blog data models
- ✓ Questionnaire foundation

**WEEK 2 will focus on**:
- Admin pages for each model (CRUD)
- API endpoints
- Form creation
- Data validation
- Admin functionality

---

## 🔗 Related Documents

- Development Guidelines: `CONTRIBUTING.md`
- Architecture: `README.md`
- Database Schema: `prisma/schema.prisma`
- Setup Instructions: `SETUP.md` (created in TASK 1.1.2)

---

**Start Date**: Monday  
**Expected Completion**: Friday EOD  
**Standup**: Daily 10:00 AM  
**Code Review Lead**: TBD per team
