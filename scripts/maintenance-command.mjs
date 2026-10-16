#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { compactRoot, maintenanceSource } from "./compact-paths.mjs";
const [name,...extra]=process.argv.slice(2);
if(!name)throw new Error("Usage: maintenance-command.mjs <package-command> [arguments]");
const source=maintenanceSource();
if(source===compactRoot)throw new Error("This command needs the full compact authoring source; set TEXT_TO_UI_COMPACT_SOURCE_ROOT");
const pkg=JSON.parse(fs.readFileSync(path.join(source,"package.json"),"utf8"));
if(!pkg.scripts?.[name] || pkg.scripts[name].includes("maintenance-command.mjs"))throw new Error("Maintenance command unavailable in source: "+name);
const cp=spawnSync("pnpm",["run",name,...extra],{cwd:source,stdio:"inherit"});
if(cp.error)throw cp.error;
process.exitCode=cp.status ?? 1;
