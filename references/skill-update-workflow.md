# Compact Skill update workflow

Use the compact directory as the maintenance source for routing, instructions, local component delivery and generators. For shared visual components, reconcile canonical contracts/implementations before refreshing the bundled snapshot.

1. Identify affected callers, routes, contracts, output modules and named references.
2. Preserve dynamic HTML delivery: index.html host, local components/, separate page and mount modules, canonical Pattern/Token styles.
3. Update sources and route references together. Rebuild the split-contract aggregate if a component contract changed.
4. Rebuild navigation and catalog indexes; check their freshness and changed-script syntax. Verify executable behavior with meaningful scenarios when execution is permitted; report any gap.
5. Refresh .delivery-manifest.json. Synchronize only a configured compact destination or an existing installed text-to-ui-compact.
6. Report source changes, checks performed and unresolved browser/Pixso evidence.

Do not modify the full Skill as a side effect of compact maintenance. Live preview, Pixso plugin execution and screenshot comparison remain distinct checks.
