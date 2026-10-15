## Creation Sequence

1. Read the active profile in `assets/design-system/mapping-registry.json`, then run
   `node scripts/validate-mapping-registry.mjs` and
   `node scripts/sync-mapping-registry.mjs --check`.
2. Run `node scripts/build-pixso-token-manifest.mjs --check`,
   `node scripts/build-token-runtime-map.mjs --check`, and
   `node scripts/build-dual-output-token-map.mjs --check`. If any output is
   stale, regenerate the chain in that order, then rerun all three checks. Read
   the active mapping profile and the generated
   `pixso-variables.json`, `token-runtime-map.json`,
   `dual-output-token-map.json`, and `references/pixso-component-bindings.md`.
3. Call `fetch_context` with `include_schema: false`; use `include_map: false` for a new creation task.
4. Load the relevant Pixso guideline topic, usually `web-app` and `design-system` for HarmonyOS PC application work.
5. Read variables, shared styles, components, and top-level Frames in grouped calls. Reuse approved resources before creating one-off layers.
6. Create the first editable direction:
   - In `html-first`, use the exact HTML draft already browser-checked at the
     approved viewport as the Web checkpoint.
   - In `visual-first`, generate the separate page/component modules from the validated page inputs, wait for dynamic rendering, and capture that same page.
   - For fast visual import (`reuseStrategy: "import-and-repair"`), use
     `code_to_design` once to import the complete browser-checked composition;
     NewComponents discovery is optional and cannot block this call.
   - For strict structured reuse, when the strict registered-reuse plan
     contains registered regions, use `code_to_design` only for a
     low-complexity Pattern skeleton and page-owned content. Insert the
     registered regions as linked instances from NewComponents before local
     refinement.
   - When no registered regions are in scope, use `code_to_design` once to
     import the composed screen layout.
   - Use `apply_design` only for variable/style bindings, linked atomic
     component replacement, and small local corrections. Do not use it as a
     second independent whole-page layout engine.
   - Assume every imported style is a literal until live read-back proves a
     `$variable/path` or shared Style binding. Repair the complete Frame before
     requesting visual approval.
   - Before `code_to_design`, run `scripts/validate-pixso-import-package.mjs`
     against the exact import ZIP with the recorded `fast` or `strict` mode.
     A failed package check is a local artifact failure; do not spend a Pixso
     call on it. In strict mode, the check must pass semantic markers and
     variable-color source usage, but only live Pixso read-back proves the
     component instances and `$variable` bindings.
   - The call must receive exactly one final `htmlStr` or `htmlBufferBase64`.
     A ZIP is required when CSS, fonts, SVGs, or images are external to the
     entry HTML; never pass a URL, path, placeholder, or both input fields.
6. Obtain the new top-level Frame ID with `get_top_level_frames` or the returned operation result.
7. Run `check_layout` with `problemsOnly: true` on the affected Frame.
8. Run `take_screenshot` on the affected Frame. Inspect content completeness,
   page and pane dimensions, typography (font, size, weight, line-height and
   wrapping), whitespace, sizing, color/opacity, border/radius/shadow,
   responsive or minimum-window behavior, missing assets/icons, clipping, and
   overlap. Report concrete node IDs or selectors for every finding.
9. Fix every visible or reported issue, then repeat layout check and screenshot.

10. Run a structural read-back in addition to `check_layout`. For the affected
    Frame, compare every descendant's `absoluteBoundingBox` with the root
    bounds and record the count and examples outside the root. Also inspect
    the auto-layout direction of major shell containers. `check_layout: null`
    is not visual proof: the HTML converter can produce a formally valid
    horizontal stack in which the body starts at `x = root.width`, leaving
    most of the page outside the frame. Repair that same container direction,
    size, or child position before style or component work.

