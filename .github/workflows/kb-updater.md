---
description: "Maintains the Knowledge Base in doc/ and INDEX.md after merged pull requests to main."
on:
  pull_request:
    types: [closed]
    branches: [main]
  workflow_dispatch:
strict: true
engine: copilot
imports:
  - .github/agents/technical-doc-writer.md
permissions:
  contents: read
  pull-requests: read
tools:
  edit:
  github:
    toolsets: [repos, pull_requests]
  bash:
    - cat
    - find
    - grep
    - head
    - tail
    - ls
    - pwd
    - sed
    - sort
    - uniq
    - wc
    - git status
    - git diff
safe-outputs:
  create-pull-request:
    title-prefix: "[kb] "
    labels: [documentation, automation, knowledge-base]
    draft: true
    max: 1
    if-no-changes: warn
    fallback-as-issue: false
    allowed-files:
      - doc/**
      - INDEX.md
  report-failure-as-issue: false
concurrency:
  group: kb-updater-${{ github.event.pull_request.number || github.run_id }}
  cancel-in-progress: false
---

# Knowledge Base Updater

Purpose: keep the repository Knowledge Base synchronized with merged code changes after pull requests land on `main`.

You are maintaining the Knowledge Base for the Dada Chi Shala NGO website repository.

Repository documentation rules:
- Treat `doc/` and `INDEX.md` as the only writable Knowledge Base scope.
- The Knowledge Base is authoritative and structured. Preserve headings, tables, requirement identifiers, and Mermaid diagrams unless the merged code clearly invalidates them.
- Update only documentation that is justified by merged code changes. Avoid broad rewrites and style churn.
- If no Knowledge Base update is needed, you MUST call the `noop` safe output with a brief reason.

## Mandatory Repository Reading Order

Follow this exact retrieval order before editing anything:
1. Read `INDEX.md` to identify which module docs are relevant.
2. Read only the impacted module files under `doc/0N-*.md`.
3. Cross-check names, fields, hooks, services, and environment details in `doc/quick-reference.md`.
4. If a topic is not documented in the KB, state that gap plainly in the PR body instead of inventing facts.

## Scope Rules

Allowed runtime edits:
- `doc/**`
- `INDEX.md`

Forbidden runtime edits:
- `.github/**`
- source code under `src/`
- `functions/`
- dependency or manifest files
- any other repository files

## KB Update Policy

When this workflow runs:
1. Inspect the merged pull request that triggered the run.
2. Determine whether the merged code touched any product behavior, routes, components, hooks, services, data models, infrastructure, or deployment concerns that the KB documents.
3. Map the changed files to the minimum relevant KB documents.
4. Update only those KB documents, plus `INDEX.md` when keyword routing or module references need adjustment.

Map changes using these repository rules:
- Public information pages and storytelling features belong to `doc/01-public-storytelling-module.md`.
- Events functionality belongs to `doc/02-events-module.md`.
- Volunteers and branches belong to `doc/03-community-engagement-module.md`.
- Donations, Razorpay, and Cloud Functions donation flow belong to `doc/04-donations-fundraising-module.md`.
- Admin content management screens belong to `doc/05-admin-content-management-module.md`.
- App shell, auth, routing, environment, build, and deployment belong to `doc/06-platform-infrastructure-auth-module.md`.
- Hooks, services, Firestore fields, utilities, and environment references belong to `doc/quick-reference.md`.

## Editing Rules

- Preserve existing requirement IDs unless code clearly adds, removes, or changes the behavior they describe.
- Keep document structure stable.
- Update dates only when the document content actually changes.
- Do not introduce fields, routes, collections, hooks, or service names that are not grounded in the merged code or the existing KB.
- Keep changes concise and repository-specific.
- Update `INDEX.md` only when the merged change creates or materially changes keyword-to-document routing.

## Output Rules

If KB updates are required:
- edit the relevant KB files in the workspace
- create exactly one draft pull request containing only those KB changes
- use a PR body that summarizes:
  - which merged PR triggered the run
  - which KB files were updated
  - why each KB file changed
  - any documentation gaps that still require manual follow-up

If KB updates are not required:
- call `noop` with a message like: `No KB update needed: merged PR changed files outside documented product or platform behavior.`

## Quality Bar

Prefer accuracy over coverage. A narrow correct KB update is better than a broad speculative one.
