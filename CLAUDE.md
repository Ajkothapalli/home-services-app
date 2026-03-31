# HomeServ — Claude Code Overrides

> Full project instructions are in **AGENTS.md** in this same folder.
> This file contains Claude Code-specific additions only.

## Read AGENTS.md First

Before doing anything, read `AGENTS.md` in the project root. That file contains the complete build instructions, design system specs, component interfaces, mock data, and build order. Follow it exactly.

## Claude Code-Specific Notes

- Skills for this project live in `.claude/skills/` (Antigravity uses `.agent/skills/` instead)
- Use `CLAUDE.md` (this file) for Claude Code, `AGENTS.md` for Antigravity — they share the same instructions
- When running terminal commands, prefer `npm run dev` over `yarn` unless a `yarn.lock` already exists
- If you use the TodoWrite tool, mirror the 30-step build order from AGENTS.md as your todo list
- Always read the full `AGENTS.md` before starting — do not rely on memory from a previous session

## Quick Reference

```
Design tokens:    src/styles/tokens.css
Design system:    src/design-system/
Mock data:        src/lib/mock-data.ts
Utils:            src/lib/utils.ts
Showcase page:    /design-system  ← build this before any product screen
```

## Start

Say **"go"** to begin. Claude will scaffold the project and build the Button component first.
