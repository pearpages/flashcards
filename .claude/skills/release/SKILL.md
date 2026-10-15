---
name: release
description: Release a new version of the app. Bumps package.json (patch, minor or major) with npm version, commits it and creates the matching v* tag, pushes main and the tag (the tag triggers the GitHub Pages deploy to flashcards.pearpages.com) and creates the GitHub release with notes. Use when the user asks to release, publish, ship or deploy a version, or invokes /release [patch|minor|major].
argument-hint: "[patch|minor|major]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git fetch:*), Bash(git rev-parse:*), Bash(git describe:*), Bash(git add:*), Bash(git commit:*), Bash(git tag:*), Bash(git push:*), Bash(npm version:*), Bash(npm run:*), Bash(gh release:*), Bash(gh run:*), Bash(gh auth status:*), Read, Edit
---

# release — bump, tag, push and publish a version

A release here is a `v*` tag on `main`. Pushing the tag runs
`.github/workflows/deploy.yml`, which builds the app and publishes it to GitHub Pages at
https://flashcards.pearpages.com. The tag always equals the `package.json` version.

The argument is the bump: `patch` (fixes, content tweaks), `minor` (new cards, decks or
features) or `major` (breaking changes, e.g. links or deck ids that stop working). If it's
missing, look at the commits since the last tag, recommend one and ask.

## Step 1 — Preconditions (stop and report if any fail)

```bash
git status --short                      # must be empty
git rev-parse --abbrev-ref HEAD         # must be main
git fetch origin && git status -sb      # must not be behind or diverged from origin/main
gh auth status                          # gh must be logged in
git describe --tags --abbrev=0          # last tag (none on the first release)
```

- Not on `main`: stop. Feature work is merged into `main` first; never release from a
  branch.
- Dirty tree: stop and ask whether to commit (`commit-message`) or stash the changes.
  `npm version` refuses to run on a dirty tree anyway.

## Step 2 — Check the build

```bash
npm run lint
npm run build
```

Both must pass: the deploy workflow runs the same checks, and a failing tag leaves a
release on GitHub with no site behind it. (Use `npm run`; the pnpm shim may have no
version set.)

## Step 3 — Confirm the plan

Show the user, then wait for an explicit yes. This step publishes the site.

```
Release v<current> → v<next> (<bump>) from main
Commits since <last tag>:
  <git log --oneline <last tag>..HEAD, or the last ~20 commits on the first release>
Will: commit + tag v<next>, push main, push the tag (deploys flashcards.pearpages.com),
create the GitHub release.
```

## Step 4 — Bump, commit and tag

Add a dated line at the top of **Done** in `tasks.md`
(`- [x] YYYY-MM-DD: Released v<next>.`). `npm version` refuses to run with that edit in the
tree, so bump without git and commit and tag by hand:

```bash
npm version <bump> --no-git-tag-version
git add package.json tasks.md
git commit -m "release <next>"
git tag -a v<next> -m "release <next>"
```

No co-author or AI trailer in the commit.

## Step 5 — Push the commit, then the tag

```bash
git push origin main
git push origin v<next>
```

Push the commit first so the tag's commit is on `main` when the workflow starts. Push only
this tag, never `--tags` (it would push stray local tags).

## Step 6 — Create the GitHub release

```bash
gh release create v<next> --title "v<next>" --generate-notes --verify-tag
```

`--verify-tag` makes sure the release uses the pushed tag instead of creating a new one.
On the first release (no previous tag), `--generate-notes` lists every merged PR; if
there are none, write short notes from the commit list instead with `--notes`.

## Step 7 — Report

```bash
gh run list --workflow deploy.yml --limit 1
```

Report the version, the release URL and the deploy run's URL and status. Don't wait for the
run to finish unless the user asks; if it fails, show `gh run view <id> --log-failed`.

## If something goes wrong

- **The tag push was rejected or the deploy failed before anything was public:** fix it,
  then release the next patch version. Don't move or re-push an existing tag.
- **The deploy failed with "not allowed to deploy to github-pages":** the
  `github-pages` environment needs a deployment rule allowing `v*` tags (Settings →
  Environments). Re-run the workflow after fixing it: `gh run rerun <id>`.
- Never delete a pushed tag or a published release without the user asking.
