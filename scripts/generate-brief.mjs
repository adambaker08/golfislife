// Morning job: pick a topic, do light research via Claude's own
// knowledge + web search tool, and write a brief for the afternoon
// drafting job to use. Writes to scripts/briefs/<date>.json.
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

const TOPIC_ROTATION = [
  "Gear",
  "Courses",
  "Travel",
  "Gear",
  "Courses",
  "Travel",
  "Gear",
];

function pickCategory() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return TOPIC_ROTATION[dayOfYear % TOPIC_ROTATION.length];
}

async function main() {
  const category = pickCategory();
  const today = new Date().toISOString().slice(0, 10);

  const briefsDir = path.join(process.cwd(), "scripts", "briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  // Avoid repeating recent topics: gather existing post titles for context
  const postsDir = path.join(process.cwd(), "src/content/posts");
  const existingTitles = fs
    .existsSync(postsDir)
    ? fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
        .slice(-30)
    : [];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: CONTENT_RULES,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [
      {
        role: "user",
        content: `Generate ONE content brief for a new blog post in the
"${category}" category for a UK golf gear/travel/courses site.

Recently published post slugs (avoid duplicating these topics):
${existingTitles.join(", ") || "(none yet)"}

Use web search if it helps ground the brief in real, current facts
(e.g. a real course, a real product category, a real destination) —
but do not invent specific prices, specs, or quotes if you can't find
them.

Respond ONLY with valid JSON, no markdown fences, no preamble:
{
  "category": "${category}",
  "working_title": "...",
  "angle": "one or two sentences on the specific angle/take",
  "research_notes": "bullet-style factual notes gathered, or 'none found' if search didn't help",
  "must_avoid": "anything specifically to avoid per content-rules.md for this topic"
}`,
      },
    ],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  const rawText = textBlocks.map((b) => b.text).join("\n").trim();
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let brief;
  try {
    brief = JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse brief JSON:", cleaned);
    process.exit(1);
  }

  const outPath = path.join(briefsDir, `${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(brief, null, 2));
  console.log(`Brief written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
