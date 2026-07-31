# GolfisLife

A Next.js blog on golf gear, travel, and courses, with a two-a-day
automated content pipeline powered by the Claude API.

## How it works

- **07:00 UK** — `morning-brief.yml` runs `scripts/generate-brief.mjs`,
  which picks a category (rotates Gear → Courses → Travel), does light
  research via Claude + web search, and commits a brief to
  `scripts/briefs/<date>.json`.
- **15:00 UK** — `afternoon-publish.yml` runs `scripts/generate-post.mjs`,
  which drafts a full post from that brief, self-checks it against
  `content-rules.md`, and either:
  - commits it to `src/content/posts/` (published, live after Vercel
    redeploys), or
  - commits it to `needs-review/` with a note on what failed, if the
    self-check doesn't pass.
- Every push to `main` triggers a Vercel redeploy automatically once
  connected (see below).

**Nothing publishes without passing the self-check** — read
`content-rules.md` before you rely on this; it's the actual guardrail,
not just documentation.

## One-time setup

### 1. Push this repo to GitHub
```bash
cd golfislife
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/golfislife.git
git push -u origin main
```

### 2. Connect Vercel
- Go to vercel.com → "Add New Project" → Import the `golfislife` repo.
- Framework preset: Next.js (auto-detected). No config changes needed.
- Deploy. You'll get a live URL immediately (e.g. `golfislife.vercel.app`).
- Every future push to `main` redeploys automatically — including the
  bot's daily commits.

### 3. Add your Anthropic API key as a GitHub secret
- In your GitHub repo: Settings → Secrets and variables → Actions →
  New repository secret.
- Name: `ANTHROPIC_API_KEY`
- Value: your key from console.anthropic.com (Settings → API Keys).
- Set a monthly spend cap in the Anthropic Console (Settings → Billing
  → Limits) so this can't run away on cost.

### 4. Enable Actions on the repo
- GitHub Actions is on by default for public repos, but double-check
  under the repo's "Actions" tab that workflows aren't disabled.
- You can manually trigger either workflow from the Actions tab
  ("Run workflow" button) to test before waiting for the schedule.

### 5. Before the first real automated post
- Fill in `src/content/approved-partners.md` with any real affiliate
  programmes you've actually joined. Until this file has entries, the
  pipeline will never add an affiliate link — it'll just write
  informational posts with no links, which is the safe default.
- Skim `content-rules.md` and adjust anything that doesn't match how
  you actually want the site to sound or what you're comfortable
  publishing unattended.

## Local development
```bash
npm install
npm run dev
```
Visit http://localhost:3000.

To test the content pipeline locally instead of waiting for the
schedule:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
node scripts/generate-brief.mjs
node scripts/generate-post.mjs
```

## Checking on it day to day
- `needs-review/` is where failed posts land — check it periodically;
  nothing there is live on the site.
- GitHub → Actions tab shows every run, success or failure, with full
  logs.
- Vercel dashboard shows every deploy and the live site preview.
