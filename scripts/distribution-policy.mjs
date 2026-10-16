export function deliveryRole(file) {
  file=file.replaceAll("\\","/");
  if (!belongsInSkill(file)) return "external-symbol-library";
  if (/^scripts\/test-/.test(file) || file.startsWith("preview/") || file.startsWith("maintenance/")) return "development";
  if (file.startsWith("scripts/pixso-native-renderer-plugin/")) return "legacy-plugin";
  if (file.startsWith("scripts/pixso-icon-helper-v8-add/")) return "specialized-repair";
  if (file.startsWith("scripts/pixso-component-registry-sync-plugin/") && !file.endsWith("/main.js")) return "standalone-sync-ui";
  if (file.startsWith("scripts/pixso-unified-agent-plugin/") && (file.endsWith(".mjs") || file.endsWith(".template.js") || file.endsWith("/pixso-native-execution-runtime.js"))) return "plugin-build-input";
  return "runtime";
}
export function belongsInRuntime(file) { return deliveryRole(file)==="runtime"; }

export function belongsInSkill(file) {
  file=file.replaceAll("\\","/");
  return file !== "assets/icons/harmonyos" && !file.startsWith("assets/icons/harmonyos/");
}
