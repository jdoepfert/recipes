# Recipe Format Conventions

## Tags (YAML Frontmatter)

Every recipe **must** start with YAML frontmatter containing its tags:

```yaml
---
tags: [vegan, glutenfrei]
---
```

Available tags (choose all that apply):

| Tag | Bedeutung |
| --- | --- |
| `vegan` | Rein pflanzlich, keine tierischen Produkte |
| `vegetarisch` | Vegetarisch (erlaubt Eier, Milchprodukte, Honig) |
| `glutenfrei` | Enthält keinerlei Gluten |
| `wenig-gluten` | Enthält nur geringe Mengen Gluten (z. B. nur durch Sojasauce) |
| `high-protein` | Mehr als 7,5 g Protein pro 100 g |

If none of the tags apply, use `tags: []`. Do not add custom tags beyond this list.

To determine which tags are appropriate, research every ingredient via `websearch`. For each ingredient check whether it contains animal products (for `vegan`/`vegetarisch`) or gluten (for `glutenfrei`/`wenig-gluten`). If the only source of gluten in a recipe is a small amount of a condiment (e.g. soy sauce), use `wenig-gluten` instead of omitting the category entirely. For `high-protein`, check the calculated protein value per 100 g in the nutritional table.

## Recipe Structure

Every recipe **must** follow this exact section order:

1. `## Allgemeine Hinweise`
2. `## Zutaten`
3. `## Zubereitung`
4. `## Nährstoffe und Kalorien`

The structure must stay the same for every recipe. Do not rename, reorder, or omit sections.

## Nutritional Value Section

Every recipe **must** include a `## Nährstoffe und Kalorien` section following the schema from `linsen-cashew-aufstrich.md`:

1. Start with a sentence: `Das Rezept ergibt ca. X g ... Alle Angaben sind Richtwerte.`
2. Add a summary table with these columns:
   ```
   | | Gesamtes Rezept | Pro 100 g | Pro Portion (ca. X g) |
   | --- | --- | --- | --- |
   ```
3. Rows (in this order): Kalorien, Protein, Kohlenhydrate, davon Zucker, Fett, davon gesättigte Fettsäuren, Ballaststoffe
4. Add a `### Nährwerte der Zutaten (pro 100 g)` subsection with a per-ingredient nutritional table.
5. End with a `Berechnungsgrundlage` paragraph explaining the ingredient quantities used for the calculation.

## Missing Nutritional Data

If a recipe does not yet have a `## Nährstoffe und Kalorien` section, use `websearch` to research per‑100‑g nutritional values for each ingredient. Prefer reliable sources (e.g. USDA, German nutrition databases). Then compute the totals, build the tables, and add the section following the schema above.

### Example Reference

See `linsen-cashew-aufstrich.md` for the complete reference implementation.
