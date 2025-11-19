# AI Agent Configuration

## Project Context

This is a full-stack monorepo using:
- **Frontend**: Angular 20 with Nx, Tailwind CSS, signals-based state management
- **Backend**: FastAPI (Python 3.10+) with in-memory data store
- **Monorepo**: Nx workspace with shared libraries
- **Testing**: Jest (FE), pytest (BE), Robot Framework (E2E)
- **Package Management**: npm (FE), uv (BE)

## Architecture Overview

```
apps/
  ├── api/          # FastAPI backend (port 8000)
  ├── frontend/     # Angular 20 app (port 4200)
  └── tests/        # Backend pytest tests

libs/
  ├── frontend-data-access/  # Angular services & HTTP layer
  ├── frontend-ui/           # Shared UI components
  └── shared-types/          # TypeScript interfaces shared across FE

tasks/                       # Task definitions for development workflow
```

## Agent Instructions

### General Guidelines

1. **Code Style**
   - Use existing patterns from the codebase
   - Prefer editing over creating new files
   - Follow TypeScript strict mode conventions
   - Use Angular signals for state management
   - Keep FastAPI handlers simple and focused

2. **File Operations**
   - Always read files before editing
   - Use the Edit tool for modifications, not bash/sed
   - Never create documentation files unless explicitly requested
   - Respect existing project structure

3. **Testing Requirements**
   - Backend: Write pytest tests in `apps/tests/`
   - Frontend: Use Jest with Angular testing utilities
   - Always run tests after making changes
   - Aim for comprehensive coverage of new features

### Backend (FastAPI) Development

**Key Files:**
- `apps/api/main.py` - Route definitions
- `apps/api/models.py` - Pydantic models
- `apps/api/seed.py` - In-memory data store

**Patterns:**
```python
# Use Pydantic enums for validation
from .models import SiteStatus

# Optional query parameters with proper typing
@app.get("/api/resource")
def handler(filter: Status | None = None) -> list[Model]:
    # FastAPI auto-validates and returns 422 on invalid input
    pass
```

**Testing:**
```bash
# Run from repo root
uv run pytest apps/tests/ -v

# Run from apps/ directory
cd apps && uv run pytest tests/
```

### Frontend (Angular) Development

**Key Files:**
- `apps/frontend/src/app/*.page.ts` - Page components (standalone)
- `libs/frontend-data-access/src/lib/*.service.ts` - HTTP services
- `libs/shared-types/src/lib/*.model.ts` - TypeScript types

**Patterns:**
```typescript
// Use signals for reactive state
selectedFilter = signal<SiteStatus | null>(null);

// Services use signals for loading/error states
readonly sites = this.sitesSignal.asReadonly();

// Optional parameters in HTTP requests
getSites$(status?: SiteStatus): Observable<Site[]> {
  const query = status ? `?status=${status}` : "";
  return this.http.get<Site[]>(`${this.baseUrl}/sites${query}`);
}
```

**Testing:**
```bash
# Test specific libraries
npx nx test frontend-data-access --no-watch
npx nx test frontend --no-watch

# Run all tests
npx nx run-many --target=test --all
```

### Common Development Tasks

**Adding a New API Filter:**
1. Update route handler with optional parameter
2. Add filtering logic using list comprehension
3. Create pytest tests covering happy path + validation errors
4. Update OpenAPI docs automatically (FastAPI handles this)

**Adding a New UI Filter:**
1. Add type to `shared-types` if needed
2. Update service method to accept filter parameter
3. Add UI controls to page component
4. Track filter state with signals
5. Write Jest tests for service and component

**Running the Application:**
```bash
# Standard development (both services)
npm run dev

# Individual services
npx nx serve api
npx nx serve frontend --host=0.0.0.0 --port=4200

# Docker (recommended for clean environment)
docker compose up --build
docker compose -f docker-compose.dev.yml up  # with hot reload
```

### Code Review Checklist

When reviewing changes:
- ✅ Backward compatibility maintained (no breaking changes)
- ✅ All tests pass (both BE and FE)
- ✅ Error handling preserved
- ✅ Loading states work correctly
- ✅ Type safety enforced (no `any` types)
- ✅ English-only text in UI
- ✅ Consistent naming conventions
- ✅ No console.log statements in production code
- ✅ Proper accessibility attributes (aria-labels, testids)

### Troubleshooting

**Backend:**
- Python env issues: `npx nx run api:sync` to recreate venv
- Import errors: Ensure you're in `apps/` when running pytest
- FastAPI validation: Use Pydantic models, not manual validation

**Frontend:**
- Module not found: Check `tsconfig.base.json` paths
- Test failures: Clear Jest cache with `npx nx reset`
- Signal errors: Ensure signals are used consistently (no mixing with observables for state)

**Docker:**
- Port conflicts: Stop local services before `docker compose up`
- Dependency changes: Always use `--build` flag
- Permission issues: Check file ownership in mounted volumes

### Task Workflow Reference

The `tasks/` directory contains structured task definitions:
- `task-1.md` - Backend API changes
- `task-2.md` - Backend tests
- `task-3.md` - Frontend UI implementation
- `task-4.md` - Frontend tests
- `task-5.md` - Code review

Follow the acceptance criteria in each task file for quality standards.

## Environment Variables

**Development (optional):**
- `API_URL` - Override backend URL (default: http://localhost:8000)
- `FRONTEND_URL` - Override frontend URL (default: http://localhost:4200)

**Docker:**
- Configured in `docker-compose.yml` and `docker-compose.dev.yml`
- Uses internal service names for networking

## IDE Configuration

**VS Code Extensions:**
- Nx Console - Monorepo task runner
- ESLint - Linting
- Prettier - Code formatting
- Jest Runner - Test execution

**Settings:**
- Format on save enabled
- ESLint fix on save enabled
- Prettier as default formatter
- See `.vscode/settings.json` for full configuration
