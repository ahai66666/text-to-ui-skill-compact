# HTML Component Package Integration

This Skill includes a snapshot of the HTML component runtime, contracts, shared styles, Pattern Runtime, and Tokens under its own `packages/` directory. Use these local files for component lookup and review. Shared component changes should be made in the canonical Text-to-UI repository and then copied into this Skill.

## Find the local component packages

Verify that the repository root contains:

```text
pnpm-workspace.yaml
packages/component-contracts/src/components.json
packages/component-contracts/src/registry.json
packages/component-contracts/src/components/<id>.json
packages/components-html/
packages/component-styles/
packages/pattern-runtime/
packages/tokens/
```

Set `RULES_ROOT` to this Skill directory and resolve the component, Token, instruction, asset, and script paths from it. Its `pnpm-workspace.yaml` links the five local packages. HTML generation uses this directory as both --repo and --skill-root and prepares project-local components. A separate complete repository is required for workflows that invoke its `tools/`, `apps/`, or `skill-support/scripts/`; set `REPO_ROOT` separately and compare the component snapshot before using a repository generator. If a required runtime package is missing, stop before claiming registered component reuse.

## Component lookup and evidence

Use this order:

1. `references/index/generated/component-index.json` to find the capability and exact `contractPath`.
2. The selected `packages/component-contracts/src/components/<id>.json` for its logical name, variants, states, props, slots, behavior, Token roles, readiness, and HTML implementation pointer. `packages/component-contracts/src/registry.json` holds registry-wide metadata; `components.json` is a generated compatibility aggregate.
3. `packages/components-html` for the production HTML renderer and component source.
4. `packages/component-styles` for shared component appearance.
5. `packages/tokens` for canonical CSS variables and token mappings.
6. `assets/design-system/` and `references/` for Pixso logical mapping. Resolve document GUIDs at runtime; do not store them in the Skill.

A registered component is reused only when the page calls its production HTML renderer, passes content through supported inputs, preserves the contract attributes, and has matching runtime evidence. A class name, screenshot, or `data-component` added by page CSS is not proof.

When no registered HTML implementation can perform the task, follow the canonical contract before considering a page-owned composition. Record registry evidence for either path. Keep custom CSS inside the declared business region and use canonical Tokens and icon aliases.

## Preview and Pixso

Use the managed HTTP Component Gallery to inspect real HTML components. `file://` screenshots and copied gallery markup do not prove runtime reuse. For Pixso, create linked instances from the exact registered logical names and read back the component, slots, and variable bindings. Report linked-instance counts, fallback reasons, and visual-diff evidence separately.

For generation gates, read `references/html-component-reuse-gate.md`. For the Windows offline bundle lifecycle, read `references/offline-distribution.md`; an offline package must include the same HTML contracts, renderer, styles, and Tokens as its Skill version.
