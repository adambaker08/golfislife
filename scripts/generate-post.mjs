// Afternoon job: read today's brief, draft a full post, run a
// self-check against content-rules.md, and either publish (write to
// src/content/posts/) or park it in needs-review/ if checks fail.
//
// Requires env var: ANTHROPIC_API_KEY

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CONTENT_RULES = fs.readFileSync(
  path.join(process.cwd(), "content-rules.md"),
  "utf-8"
);
const APPROVED_PARTNERS = fs.readFileSync(
  path.join(process.cwd(), "src/content/approved-partners.md"),
  "utf-8"
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function draftPost(brief) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2500,
    system: CONTENT_RULES,
    messages: [
      {
        role: "user",
        content: `Approved affiliate partners (only these may get a link):
${APPROVED_PARTNERS}

Brief:
${JSON.stringify(brief, null, 2)}

Write the full blog post now. Output ONLY the raw Markdown file
content, starting with YAML frontmatter (title, description, date,
category), then the body. No commentary outside the file content.`,
      },
    ],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  return textBlocks.map((b) => b.text).join("\n").trim();
}

async function selfCheck(draftMarkdown, brief) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: CONTENT_RULES,
    messages: [
      {
        role: "user",
        content: `Approved affiliate partners:
${APPROVED_PARTNERS}

Review this drafted post against content-rules.md's five-point
self-check. Respond ONLY with JSON, no markdown fences:
{
  "pass": true or false,
  "issues": ["list of specific issues found, empty array if pass"]
}

Draft post:
${draftMarkdown}`,
      },
    ],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  const raw = textBlocks.map((b) => b.text).join("\n").trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { pass: false, issues: ["Self-check response was not valid JSON"] };
  }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const briefPath = path.join(process.cwd(), "scripts", "briefs", `${today}.json`);

  if (!fs.existsSync(briefPath)) {
    console.error(`No brief found for ${today} at ${briefPath}. Run generate-brief first.`);
    process.exit(1);
  }

  const brief = JSON.parse(fs.readFileSync(briefPath, "utf-8"));

  const draft = await draftPost(brief);
  const check = await selfCheck(draft, brief);

  const slug = `${slugify(brief.working_title || "post")}-${today}`;

  if (check.pass) {
    const outDir = path.join(process.cwd(), "src/content/posts");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${slug}.md`), draft);
    console.log(`Published: src/content/posts/${slug}.md`);
  } else {
    const reviewDir = path.join(process.cwd(), "needs-review");
    fs.mkdirSync(reviewDir, { recursive: true });
    const note = `<!--\nSELF-CHECK FAILED — not published.\nIssues:\n${check.issues
      .map((i) => `- ${i}`)
      .join("\n")}\n-->\n\n${draft}`;
    fs.writeFileSync(path.join(reviewDir, `${slug}.md`), note);
    console.log(`Held for review: needs-review/${slug}.md`);
    console.log("Issues:", check.issues);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
