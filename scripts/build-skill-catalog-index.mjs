#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  generatedIndexDir, locateMonorepo, parseArgs, resolveSkillRoot, sha256File, stableJson
} from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const located = locateMonorepo({ start: args.start || process.cwd(), explicitRepo: args.repo });
if (!located.root) throw new Error(`Text-to-UI Monorepo not found. Tried:\n${located.attempted.join('\n')}`);
const repo = located.root;
const skillRoot = resolveSkillRoot(repo, args['skill-root']);

const groups = [
  ['routing-and-receipts', 'Route selection, Context Packet material closure, and read-receipt verification.', ['skill-support/references/routes/index.json', 'skill-support/references/routes/materials.source.json', 'skill-support/references/routes/skill-maintenance.md', 'skill-support/scripts/resolve-workflow-route.mjs', 'skill-support/scripts/task-route-lib.mjs', 'skill-support/scripts/resolve-context.mjs', 'skill-support/scripts/test-task-route-resolution.mjs', 'skill-support/scripts/verify-route-materials.mjs', 'skill-support/scripts/verify-context-materials.mjs']],
  ['patterns-and-runtime', 'Pattern contracts, Skeleton/Runtime renderers, deterministic Titlebar scenes, and Secondary Page composition.', ['skill-support/assets/design-system/pattern-contracts.json', 'skill-support/assets/design-system/pattern-contracts.schema.json', 'skill-support/assets/design-system/titlebar-scene-contracts.json', 'packages/pattern-runtime/src/index.js', 'packages/pattern-runtime/src/styles.css', 'skill-support/scripts/resolve-pattern-contract.mjs', 'skill-support/scripts/titlebar-scene.mjs', 'skill-support/scripts/validate-pattern-contracts.mjs', 'skill-support/scripts/test-pattern-runtime.mjs', 'skill-support/scripts/test-ui-scene-pattern-binding.mjs']],
  ['component-contracts-and-adapters', 'HTML component identity, Props, Slots, selection, readiness, adapters, and registered reuse.', ['packages/component-contracts/src/components.json', 'packages/component-contracts/src/registry.json', 'packages/components-html/src/index.js', 'packages/component-contracts/src/titlebar-segments.js', 'skill-support/references/components/component-selection-rules.json', 'skill-support/references/components/component-readiness-policy.json', 'skill-support/assets/design-system/html-component-adapter-map.json', 'skill-support/scripts/query-components.mjs', 'skill-support/scripts/validate-runtime-component-reuse.mjs', 'skill-support/scripts/validate-web-component-reuse.mjs']],
  ['tokens-type-and-icons', 'Semantic Token maps, colors, typography, layout, and icon aliases.', ['packages/tokens/src/token-runtime-map.json', 'packages/tokens/src/tokens.colors.css', 'packages/tokens/src/tokens.typography.css', 'packages/tokens/src/tokens.layout.css', 'packages/tokens/src/tokens.spacing.css', 'packages/tokens/src/tokens.icon.css', 'skill-support/assets/icons/icon-aliases.json', 'skill-support/assets/design-system/pixso-icon-map.json', 'skill-support/scripts/validate-page-token-usage.mjs', 'skill-support/scripts/validate-pixso-icon-map.mjs']],
  ['ui-scene-and-generation', 'Shared UI Scene, page decision layers, compiler, and strict page generation.', ['skill-support/assets/design-system/ui-scene.schema.json', 'skill-support/assets/design-system/page-spec.schema.json', 'skill-support/scripts/page-ui-scene.mjs', 'skill-support/scripts/compile-ui-scene.mjs', 'skill-support/scripts/page-blueprint.mjs', 'skill-support/scripts/page-content-recipes.mjs', 'skill-support/scripts/generate-html-page.mjs', 'skill-support/scripts/generate-compliant-page.mjs']],
  ['gates-and-runtime-evidence', 'Reuse, Token, layout, artifact, and browser Runtime evidence gates.', ['skill-support/scripts/validate-page-composite-boundaries.mjs', 'skill-support/scripts/validate-page-css-boundaries.mjs', 'skill-support/scripts/validate-page-layout-binding.mjs', 'skill-support/scripts/verify-html-artifact.mjs', 'skill-support/scripts/stamp-html-artifact.mjs', 'tools/validate-runtime-evidence.mjs', 'skill-support/references/workflows/fast-preview.md']],
  ['delivery-mirrors', 'Canonical delivery source, maintenance commands, and mirror synchronization implementation.', ['package.json', 'SKILL.md', 'skill-support/package.json', 'skill-support/scripts/skill-delivery.mjs', 'skill-support/references/governance/major-version-update-checklist.md', 'skill-support/references/governance/skill-catalog-refresh.md']],
  ['gallery-preview-and-baseline', 'Current Gallery/Preview source and runtime checks.', ['apps/component-gallery/runtime-catalog.js', 'apps/component-gallery/pattern-baseline.js', 'apps/component-gallery/preview.js', 'apps/component-gallery/gallery.css', 'tools/test-gallery-readiness.mjs', 'tools/validate-gallery-dist.mjs']]
];

groups.find((group) => group[0] === 'component-contracts-and-adapters')[2].push(...fs.readdirSync(path.join(skillRoot, 'packages/component-contracts/src/components')).filter((file) => file.endsWith('.json')).sort().map((file) => 'packages/component-contracts/src/components/' + file));
groups.push(['dynamic-local-components', 'Selected component modules, unified stylesheet delivery, compact model brief and dynamic HTML workflow.', [
  'skill-support/scripts/prepare-page-components.mjs',
  'skill-support/scripts/prepare-page-styles.mjs',
  'skill-support/scripts/scaffold-standalone-project.mjs',
  'skill-support/scripts/component-selection.mjs',
  'skill-support/references/components/local-component-delivery.md',
  'skill-support/references/routes/new-page.md',
  'skill-support/references/html-output-rules.md'
]]);
groups.push(['focused-stage-resources', 'Thematic source fragments, compatibility aggregates, exact resource queries and stage handoff packs.', [
  'skill-support/references/resource-workflow.md',
  'skill-support/references/resources/source.json',
  'skill-support/references/resources/source.schema.json',
  'skill-support/references/index/generated/resource-index.json',
  'skill-support/scripts/resource-index-lib.mjs',
  'skill-support/scripts/build-resource-index.mjs',
  'skill-support/scripts/stage-context-lib.mjs',
  'skill-support/scripts/query-resources.mjs',
  'skill-support/scripts/test-resource-routing.mjs',
  ...JSON.parse(fs.readFileSync(path.join(skillRoot, 'references/resources/source.json'), 'utf8')).resources.filter((r) => r.path.startsWith('references/resources/')).map((r) => 'skill-support/' + r.path)
]]);
const catalogFile = (relative) => {
  const candidates = relative.startsWith('skill-support/')
    ? [path.join(skillRoot, relative.slice('skill-support/'.length))]
    : [path.join(skillRoot, relative), path.join(repo, relative)];
  const absolute = candidates.find((file) => fs.existsSync(file));
  if (absolute) return { path: relative, sha256: sha256File(absolute), availability: 'local' };
  if (relative.startsWith('apps/') || relative.startsWith('tools/')) return { path: relative, sha256: null, availability: 'external-full-repository' };
  throw new Error('Catalog source is missing: ' + relative);
};

const catalog = {
  schemaVersion: 1,
  kind: 'text-to-ui-skill-catalog-index',
  authority: 'skill-support/references/governance/skill-catalog-refresh.md',
  policy: { canonicalSource: 'compact SKILL.md + bundled references/scripts/packages', externalServicesAreNotHtmlGenerationDependencies: true, refreshBeforeMaintenance: true, missingOrHashDriftIsBlocking: true, mirrorsAreValidatedAfterCanonicalChecks: true },
  derivedProducts: {
    generatedIndexes: 'skill-support/references/index/generated/*.json',
    builder: 'pnpm index:build',
    validator: 'pnpm index:check'
  },
  deliveryTargets: [
    'skill/ (local generated mirror; Git-ignored)',
    '$CODEX_HOME/skills/text-to-ui-compact',
    '$TEXT_TO_UI_PLUGIN_DELIVERY_ROOT'
  ],
  groups: groups.map(([id, purpose, files]) => ({ id, purpose, files: files.map((relative) => {
    return catalogFile(relative);
  }) }))
};
catalog.digest = sha256File(path.join(skillRoot, 'references', 'governance', 'skill-catalog-refresh.md'));
const output = path.join(generatedIndexDir(skillRoot), 'skill-catalog-index.json');
const expected = stableJson(catalog);
if (args.check) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== expected) {
    console.error(`Skill catalog index drift: ${path.relative(repo, output)}`);
    process.exitCode = 1;
  }
} else {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, expected);
  console.log(`Generated ${path.relative(repo, output)}`);
}
