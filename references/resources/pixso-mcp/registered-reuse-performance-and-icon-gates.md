## Registered reuse, performance, and icon gates

Read `pixso-fidelity-routing.md`, `registered-reuse-mode.md`, and
`pixso-performance.md` before a Pixso write. The selected route is part of the
write contract: fast visual import may keep page-owned literals, while strict
structured reuse must bring verified NewComponents instances and Pixso
Variables into the target page together.
For fast visual import, the HTML draft remains the source for the Web
checkpoint and Pixso imports the complete composition once; do not block on a
component-library audit. For strict structured reuse, when the planner finds
registered regions, the HTML draft remains the source for the Web checkpoint,
but Pixso imports only a low-complexity Pattern skeleton and page-owned
content. The registered components are inserted as linked instances from the
exact component-library page; code_to_design must not be used as a second
renderer for those regions.

The component-library page for strict structured reuse is NewComponents.
Follow the Target page and path preflight above for both phases. During the
library phase, compare the active page from fetch_context and each candidate
component's containing page; after switching to the target product page,
re-enumerate and compare again immediately before creating instances. The
target page does not need to be NewComponents. A same-name Frame, stale GUID,
detached node, icon_font, imported layer name, or component from another page is
not component reuse. Fast visual import may keep a page-owned Frame instead of
an instance and must report that distinction.

After import, run an icon crop audit on every generated icon wrapper and
linked icon slot. The wrapper must not clip content, the SVG root and
internal vector must use the same 24 by 24 source geometry, and the visible
16px, 20px, or approved 24px display size must be centered without cropping.
For outline icons, the same audit must preserve the effective stroke mapping:
24px = 1.5px, 20px = 1.25px, and 16px = 1px. Keep the 1.5px source stroke on
the 24 by 24 artboard and scale the root and internal vectors together; do not
correct stroke weight by independently scaling or redrawing a path.
Do not pass the browser sprite artifact directly to `code_to_design`. Create
the Pixso-specific import copy first:

```bash
node scripts/prepare-pixso-html.mjs --in /absolute/path/to/browser.html --out /absolute/path/to/browser.pixso.html --strict
```

The import copy contains inline exact-source SVG geometry and carries
`data-icon-alias`, `data-icon-source`, `data-display-size-token`, and
`data-pixso-overflow="visible"` on each icon wrapper. Do not leave sprite use
elements or `icon_font` conversions as final Pixso icons. A crop finding blocks
strict parity until the exact SVG or linked NewComponents instance is repaired.

Use one grouped discovery pass, one code_to_design call, batched edits, and
targeted read-backs. Record call count, slowest call, code_to_design duration,
node count, retries, and whether the performance budget aborted the stage.
After one bounded retry for a failed call, return the HTML draft and report
the Pixso limitation instead of continuing serial full-frame retries.

