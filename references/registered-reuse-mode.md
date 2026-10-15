# Registered HTML and Pixso Reuse

Use this strategy when an HTML page and Pixso must use the same approved Tokens, components, variants, states, icons, and Patterns. It is the strict reuse path within a selected workflow, not another workflow.

## Contract

Declare `targetFramework: "html"` in the page specification and use the registered HTML renderer. Every component uses its exact logical name, supported props and slots, and current Pixso logical mapping. Do not store Pixso GUIDs in the page spec.

## Strict path

1. Validate `page-spec.json`, route receipts, and the Layout Contract.
2. Resolve a component selection plan from the current registry and page bindings.
3. Render and browser-check the HTML page before any Pixso call.
4. In Pixso, resolve the exact source component, confirm its page and slots, then create a linked instance.
5. Bind Variables and Styles only on page-owned Pattern/content nodes.
6. Read back component identity and Token bindings; record the live audit and screenshot comparison.

Use `code_to_design` only when it materially speeds up Pattern geometry or page-specific content. Do not use it as a component renderer or re-import for incremental fixes.

## Planner results

- `verified`: instantiate in Pixso and render through the production HTML factory.
- `mapped-pending-verification`: verify a temporary linked instance before reuse.
- `mapped-needs-rebuild`: repair the shared component; do not patch the page.
- `missing-target`: record the missing shared component for library work.
- `compiled-runtime-fallback` or blocked content: allow only an explicitly requested HTML preview; do not claim strict component reuse.

Strict completion requires source calls, linked Pixso instances, readback, and Token evidence. Fast visual import may record partial reuse, but must list unbound regions and remaining literal styles.
