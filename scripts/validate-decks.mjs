// Validates every deck in src/decks/<deck>/ (deck.json + cards.json + images/).
// Runs before the build so a bad edit to the JSON fails fast with a clear message.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DECKS_DIR = new URL("../src/decks/", import.meta.url).pathname;
const MAX_SUMMARY = 90;
const MAX_DESCRIPTION = 280;
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VARIANTS = ["mobile", "ios", "android"];
const MAX_PLATFORM = 60;

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
    if (facet.filter !== undefined && typeof facet.filter !== "boolean") {
      errors.push(`${where("deck.json")}: facet "${facet.key}" filter must be true or false`);
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
    if (card.platforms !== undefined) {
      for (const [key, value] of Object.entries(card.platforms)) {
        if (!["ios", "android"].includes(key)) errors.push(`${at}: platforms.${key} is not ios or android`);
        else if (!isNonEmptyString(value)) errors.push(`${at}: platforms.${key} must be a non-empty string`);
        else if (value.length > MAX_PLATFORM) errors.push(`${at}: platforms.${key} is ${value.length} chars (max ${MAX_PLATFORM})`);
      }
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
  // "<id>.svg" plus optional "<id>.mobile.svg", "<id>.ios.svg", "<id>.android.svg"
  const images = new Set();
  const variants = Object.fromEntries(VARIANTS.map((v) => [v, new Set()]));
  for (const name of names) {
    const variant = VARIANTS.find((v) => name.endsWith(`.${v}`));
    if (variant) variants[variant].add(name.slice(0, -(variant.length + 1)));
    else images.add(name);
  }
  for (const id of ids) if (!images.has(id)) warnings.push(`${where("images")}: no ${id}.svg (card shows a placeholder)`);
  for (const image of images) if (!ids.has(image)) warnings.push(`${where("images")}: ${image}.svg has no matching card`);
  for (const variant of VARIANTS) {
    for (const image of variants[variant]) {
      const file = `${image}.${variant}.svg`;
      if (!ids.has(image)) warnings.push(`${where("images")}: ${file} has no matching card`);
      else if (!images.has(image)) warnings.push(`${where("images")}: ${file} has no desktop ${image}.svg, so it is not shown`);
    }
  }
  for (const [a, b] of [["ios", "android"], ["android", "ios"]]) {
    for (const image of variants[a]) {
      if (!variants[b].has(image)) warnings.push(`${where("images")}: ${image}.${a}.svg needs ${image}.${b}.svg too (shown as a pair)`);
    }
  }
  for (const image of variants.mobile) {
    if (variants.ios.has(image) && variants.android.has(image)) {
      warnings.push(`${where("images")}: ${image}.mobile.svg is hidden by the iOS/Android pair`);
    }
  }

  const withPlatforms = cards.filter((card) => card.platforms).length;
  console.log(
    `✓ ${folder}: ${cards.length} cards, ${deck.facets.length} facets; images: ${variants.mobile.size} mobile, ` +
      `${variants.ios.size} iOS/Android pairs; ${withPlatforms} with native names`,
  );
}

if (deckFolders.length === 0) errors.push("no decks found in src/decks/");

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) in decks`);
  process.exit(1);
}
