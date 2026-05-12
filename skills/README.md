# Skills System

Skills are bundled instruction sets loaded into the AI system prompt to specialize behavior.

## Structure

Each skill lives in its own directory:

```
skills/
  <skill-id>/
    SKILL.md       # description + instructions loaded into AI context
    examples/      # optional example outputs
```

## How skills are loaded

1. Server reads `skills/*/SKILL.md` at request time (cached in memory).
2. Each project has `activeSkills: string[]` (default: `["frontend-design"]`).
3. System prompt = base IDE instructions + concatenated active skill bodies + project context.

## Adding a skill

1. Create `skills/<id>/SKILL.md`.
2. Follow the format: start with a `# Skill: <id>` heading, then `## When to use`, then `## Instructions`.
3. Do not include `NOT_IMPLEMENTED` in the body — that marker causes the loader to skip the skill.
4. Add the skill id to a project's `activeSkills` to activate it.
