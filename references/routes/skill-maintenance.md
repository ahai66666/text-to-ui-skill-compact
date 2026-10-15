# Compact Skill maintenance

Maintain this text-to-ui-compact directory: SKILL.md, references/, scripts/, assets/, and bundled packages/. HTML workflow changes are authored here. Shared visual component changes should be reconciled with their canonical source before refreshing the snapshot. Keep the complete Skill separate.

1. Inspect callers and the relevant catalog groups. Regenerate the local catalog with pnpm catalog:build when sources change.
2. Update the task route, model brief, component delivery, page generator and named references together when the default workflow changes.
3. Keep all HTML outputs dynamically rendered with separate local component modules. Review index.html host rules, imports, Token/Pattern boundaries and Pixso readiness.
4. Refresh pnpm catalog:build and pnpm index:build, then run pnpm index:check and pnpm catalog:check. Validate changed executable behavior when the environment permits and disclose unperformed validation.
5. Refresh .delivery-manifest.json after the final source changes. Synchronize only an explicitly configured compact delivery or an existing installed text-to-ui-compact; do not overwrite the full Skill.
6. Report changed artifacts, checks performed, missing external services, and unverified browser/Pixso behavior.

Logical catalog paths with skill-support/ resolve into this compact root. Entries marked external-full-repository identify Gallery/tools services outside this package; they do not make core HTML generation depend on that checkout.

## Import reliability maintenance

- Bridge 的 `.text-to-ui/pixso-bridge/` 只保留当前 `current-plan.json`、`current-job.json`、`latest-result.json`；新发布或清理失效发布时直接移除旧文件，不生成 `archive/` 历史副本。正在执行或取消中的任务仍需先完成或取消，不能被新发布覆盖。
- Publish exclusively through the running Bridge's `POST /publish` endpoint via
  `pixso-import-orchestrator.mjs publish`. The CLI must never write a private queue.
  If an older Bridge lacks the endpoint, update the managed service; do not fall
  back to directory-based publication.
- Diagnose a stall using current operation start, last completed operation, and
  module identity. A last-completed icon is not evidence that icon creation hung.
- Heartbeats may carry newer sampled completion counters; count that advancement,
  but an unchanged heartbeat must never reset the no-progress deadline.
- Report cleanup as confirmed only when the executor reports `removed` or
  `not-created`. A cancel request alone means cleanup is pending confirmation.
- Use generic fixtures for queue splitting, timeouts, cancellation and fallback.
  Coremail is an integration fixture only: never edit its HTML to hide a converter
  or plugin failure. State separately which repository tests passed and which
  installed-plugin/live-browser checks remain unverified.
