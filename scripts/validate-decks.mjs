// Validates every deck in src/decks/<deck>/ (deck.json + cards.json + images/).
// Runs before the build so a bad edit to the JSON fails fast with a clear message.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DECKS_DIR = new URL("../src/decks/", import.meta.url).pathname;
const MAX_SUMMARY = 90;
const MAX_DESCRIPTION = 280;
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MOBILE_SUFFIX = ".mobile";

const errors = [];
const warnings = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path}: ${e.message}`);
    return null;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const deckFolders = readdirSync(DECKS_DIR).filter((name) =>
  statSync(join(DECKS_DIR, name)).isDirectory(),
);

for (const folder of deckFolders) {
  const dir = join(DECKS_DIR, folder);
  const where = (suffix) => `decks/${folder}/${suffix}`;

  const deck = readJson(join(dir, "deck.json"));
  const cards = readJson(join(dir, "cards.json"));
  if (!deck || !cards) continue;

  if (deck.id !== folder) errors.push(`${where("deck.json")}: id "${deck.id}" must match folder name "${folder}"`);
  if (!isNonEmptyString(deck.title)) errors.push(`${where("deck.json")}: missing title`);
  if (!Array.isArray(deck.facets)) {
    errors.push(`${where("deck.json")}: facets must be an array`);
    continue;
  }
  for (const facet of deck.facets) {
    if (!isNonEmptyString(facet.key) || !isNonEmptyString(facet.label) || !Array.isArray(facet.values) || facet.values.length === 0) {
      errors.push(`${where("deck.json")}: each facet needs key, label and a non-empty values array`);
    }
  }

  if (!Array.isArray(cards)) {
    errors.push(`${where("cards.json")}: must be an array of cards`);
    continue;
  }

  const ids = new Set();
  cards.forEach((card, index) => {
    const at = `${where("cards.json")} [${index}] ${card?.id ?? "(no id)"}`;

    if (!isNonEmptyString(card.id) || !ID_PATTERN.test(card.id)) {
      errors.push(`${at}: id must be kebab-case`);
    } else if (ids.has(card.id)) {
      errors.push(`${at}: duplicate id`);
    }
    ids.add(card.id);

    for (const field of ["title", "summary", "description"]) {
      if (!isNonEmptyString(card[field])) errors.push(`${at}: missing ${field}`);
    }
    if (card.summary?.length > MAX_SUMMARY) errors.push(`${at}: summary is ${card.summary.length} chars (max ${MAX_SUMMARY})`);
    if (card.description?.length > MAX_DESCRIPTION) errors.push(`${at}: description is ${card.description.length} chars (max ${MAX_DESCRIPTION})`);
    if (card.aliases !== undefined && (!Array.isArray(card.aliases) || !card.aliases.every(isNonEmptyString))) {
      errors.push(`${at}: aliases must be an array of strings`);
    }

    for (const facet of deck.facets) {
      const value = card.facets?.[facet.key];
      if (value === undefined) errors.push(`${at}: missing facets.${facet.key}`);
      else if (!facet.values.includes(value)) {
        errors.push(`${at}: facets.${facet.key} "${value}" is not one of: ${facet.values.join(", ")}`);
      }
    }
    for (const key of Object.keys(card.facets ?? {})) {
      if (!deck.facets.some((f) => f.key === key)) errors.push(`${at}: unknown facet "${key}" (not declared in deck.json)`);
    }
  });

  const imagesDir = join(dir, "images");
  const names = existsSync(imagesDir)
    ? readdirSync(imagesDir).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -".svg".length))
    : [];
  const images = new Set(names.filter((n) => !n.endsWith(MOBILE_SUFFIX)));
  const mobileImages = new Set(
    names.filter((n) => n.endsWith(MOBILE_SUFFIX)).map((n) => n.slice(0, -MOBILE_SUFFIX.length)),
  );
  for (const id of ids) if (!images.has(id)) warnings.push(`${where("images")}: no ${id}.svg (card shows a placeholder)`);
  for (const image of images) if (!ids.has(image)) warnings.push(`${where("images")}: ${image}.svg has no matching card`);
  for (const image of mobileImages) {
    if (!ids.has(image)) warnings.push(`${where("images")}: ${image}${MOBILE_SUFFIX}.svg has no matching card`);
    else if (!images.has(image)) warnings.push(`${where("images")}: ${image}${MOBILE_SUFFIX}.svg has no desktop ${image}.svg, so it is not shown`);
  }

  console.log(`✓ ${folder}: ${cards.length} cards (${mobileImages.size} with mobile variant), ${deck.facets.length} facets`);
}

if (deckFolders.length === 0) errors.push("no decks found in src/decks/");

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) in decks`);
  process.exit(1);
}
