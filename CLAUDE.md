# Project Conventions

## Stack
- React + TypeScript + Vite
- Package manager: npm

## Conventions
- Use functional components with hooks
- Commit messages follow Conventional Commits (feat, fix, docs, chore, test, refactor)
- Keep components small and single-purpose
- Prefer named exports

## Notes for AI Assistant
- Ask before installing new dependencies
- Favor readability over cleverness
- Match existing code style in the repo

## Lessons from Prompt Precision Exercise (FE-04)
- Always specify exact error message text if wording matters — the AI will invent its own otherwise.
- Explicitly request accessibility attributes (aria-invalid, aria-describedby) — they won't appear unasked.
- Request tests be written AND run, not just written — "written" alone doesn't confirm correctness.