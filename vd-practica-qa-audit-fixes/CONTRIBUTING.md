# Contributing to VD-Practica

Welcome to the vreaudigitalizare.eu development team! This document outlines the rules and processes for contributing to the project.

## 🚀 Quick Start

1. **Clone repository**
   ```bash
   git clone https://github.com/raisissoftware/vd-practica.git
   cd vd-practica
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   npm install
   docker-compose up -d
   npx prisma db push
   npm run dev
   ```

3. **Create feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/task-name
   ```

## 📋 Development Rules

### Team Structure
- **TEAM 1**: Core Platform & Admin Foundation (Auth, Layout, Audit)
- **TEAM 2**: Website Public, CMS & Blog (Homepage, CMS, Blog, SEO)
- **TEAM 3**: Questionnaire Engine, AI & Leads (Questions, Scoring, AI, PDF)

### Task Guidelines

Every task MUST:
- ✅ Be atomic (1-2 days max)
- ✅ Have clear scope & acceptance criteria
- ✅ Be in your assigned EPIC
- ✅ Follow standard task format
- ✅ Have an issue/task number

### PR Guidelines

Every PR MUST:
- ✅ Reference the task/issue
- ✅ Be ≤ 500 lines modified
- ✅ Have descriptive title: `[TEAM-X] Task: brief description`
- ✅ Include screenshots (if UI changes)
- ✅ Pass all CI checks
- ✅ Have 2 approvals (1 peer + 1 lead)

### Git Workflow

```
develop (base branch)
  ├─ feature/user-auth
  ├─ feature/homepage-hero
  ├─ fix/auth-logout
  └─ chore/update-deps
```

**FORBIDDEN**:
- ❌ Direct push to main or develop
- ❌ Force push
- ❌ Merge without approval
- ❌ Commit secrets
- ❌ Massive refactors without approval

## 💻 Code Standards

### TypeScript
- Strict mode enabled
- No `any` types
- Proper error handling
- Type all functions

### File Structure
```
/app
  /(public)         # Public website routes
  /(admin)          # Admin dashboard
  /api              # API routes

/components        # Reusable React components
/features          # Feature-specific components & logic
/lib               # Utilities & helpers
/hooks             # Custom React hooks
/services          # Business logic services
/types             # TypeScript definitions
/styles            # Global styles
```

### Component Example
```typescript
// components/forms/user-form.tsx
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

interface UserFormProps {
  initialData?: User
  onSubmit: (data: User) => void
}

export function UserForm({ initialData, onSubmit }: UserFormProps) {
  const form = useForm<User>({
    defaultValues: initialData,
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## 🔐 Security Rules

- ❌ NO API keys in code
- ❌ NO credentials in commits
- ❌ NO sensitive data in logs
- ❌ Use environment variables for secrets
- ✅ Validate all inputs
- ✅ Sanitize user content
- ✅ Use HTTPS in production
- ✅ Follow OWASP guidelines

## 🧪 Testing

Run before pushing:
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run build         # Production build
npm test              # Unit tests
```

## 📝 Commit Messages

Format: `type(scope): brief message`

```bash
git commit -m "feat(auth): add 2FA support"
git commit -m "fix(homepage): hero image responsive"
git commit -m "chore(deps): update next.js"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Build, deps, config
- `docs`: Documentation
- `refactor`: Code reorganization
- `test`: Test additions

## 🔍 Code Review Process

1. **Developer** opens PR with checklist completed
2. **Peer Reviewer** (team member) reviews code quality
3. **Team Lead** reviews for architecture compliance
4. Both must approve before merge
5. CI pipeline must pass

### Review Checklist
- [ ] Build passes
- [ ] TypeScript clean
- [ ] No secrets exposed
- [ ] No unnecessary changes
- [ ] Follows patterns
- [ ] Uses existing components
- [ ] PR ≤ 500 lines
- [ ] Screenshots included
- [ ] Task respected

## 🚀 Merging to Main

Only after:
1. Code review approved by 2+ people
2. All CI checks pass
3. Tests pass
4. No conflicts
5. Product Owner approval (for main branch)

```bash
# Team Lead merges (no force push!)
git checkout develop
git pull origin develop
git merge feature/task-name
git push origin develop
```

## 📱 AI Development

If using AI tools (Claude, Codex, etc.):

**REQUIRED PROMPT**:
```
You are working inside an existing Next.js SaaS starter project.

Rules:
- Do not refactor unrelated code.
- Do not change package versions.
- Do not modify authentication unless required.
- Follow existing folder structure.
- Use TypeScript.
- Use existing UI components.
- Keep the change small and reviewable.

Task: [your task here]
Acceptance Criteria: [criteria here]
```

**FORBIDDEN**:
- ❌ Build the whole module
- ❌ Massive refactor
- ❌ Change architecture
- ❌ Unrelated modifications

## 🐛 Reporting Issues

Use the issue template:
```
Title: [TEAM-X] [EPIC-Y] Brief description
Description: Clear steps to reproduce
Expected: What should happen
Actual: What actually happens
```

## 📚 Documentation

Update docs when:
- Adding new feature
- Changing API
- Modifying database schema
- Creating new service

## ❓ Questions?

Contact your Team Lead:
- TEAM 1 Lead: <!-- Name -->
- TEAM 2 Lead: <!-- Name -->
- TEAM 3 Lead: <!-- Name -->

Or open a discussion in the repository.

---

**Remember**: We're building an enterprise software product, not a website. Code quality, clarity, and maintainability are paramount. ✨
