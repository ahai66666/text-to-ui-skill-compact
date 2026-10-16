import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const compactRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export function servicePaths(env = process.env) {
  const full = env.TEXT_TO_UI_FULL_REPOSITORY || env.TEXT_TO_UI_MONOREPO;
  const repository = full ? path.resolve(full) : compactRoot;
  const gallery = env.TEXT_TO_UI_GALLERY_ROOT ? path.resolve(env.TEXT_TO_UI_GALLERY_ROOT) : full ? path.join(repository,"apps/component-gallery") : null;
  return {skillRoot:compactRoot,repository,gallery,bridgeState:path.resolve(env.TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR||path.join(compactRoot,".text-to-ui/pixso-bridge"))};
}
export function maintenanceSource(root=compactRoot) {
  const marker=path.join(root,".compact-distribution.json");
  const distribution=fs.existsSync(marker)?JSON.parse(fs.readFileSync(marker,"utf8")):null;
  const source=process.env.TEXT_TO_UI_COMPACT_SOURCE_ROOT || (distribution?.sourceRelativePath ? path.resolve(root,distribution.sourceRelativePath) : root);
  if(!fs.existsSync(path.join(source,"SKILL.md")))throw new Error("Maintenance source missing; set TEXT_TO_UI_COMPACT_SOURCE_ROOT to the complete compact authoring directory");
  return path.resolve(source);
}
