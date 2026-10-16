#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { skillFiles, deliveryManifest } from "./skill-delivery.mjs";
import { deliveryRole, belongsInRuntime } from "./distribution-policy.mjs";
import { parseArgs } from "./navigation-index-lib.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const args=parseArgs(process.argv.slice(2));
if(!args.out)throw new Error("Usage: build-compact-distribution.mjs --out <empty-directory> [--profile runtime|complete]");
const out=path.resolve(args.out), profile=args.profile||"runtime";
if(!["runtime","complete"].includes(profile))throw new Error("Unknown distribution profile");
if(out===root || out.startsWith(root+path.sep))throw new Error("Distribution must be outside the authoring Skill");
if(fs.existsSync(out)&&fs.readdirSync(out).length)throw new Error("Preserve existing output; provide an empty directory");
const files=skillFiles(root), selected=files.filter(file=>profile==="complete"||belongsInRuntime(file));
const stage=out+".building-"+process.pid;
if(fs.existsSync(stage))throw new Error("Staging directory already exists");
fs.mkdirSync(stage,{recursive:true});
try {
  for(const file of selected) {
    const target=path.join(stage,file);
    fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);
  }
  const marker={schemaVersion:1,profile,sourceRelativePath:path.relative(out,root),sourceVersion:JSON.parse(fs.readFileSync(path.join(root,"package.json"))).version,sourceDigest:deliveryManifest(root).sourceDigest,
    policy:"All six routes remain discoverable. Development commands use the matching compact authoring source; page generation and current Pixso execution stay local. Only component icons are bundled; the external Symbol library is excluded from every profile."};
  fs.writeFileSync(path.join(stage,".compact-distribution.json"),JSON.stringify(marker,null,2)+"\n");
  const pkgFile=path.join(stage,"package.json"),pkg=JSON.parse(fs.readFileSync(pkgFile));
  const maintenance=[];
  if(profile==="runtime")for(const [name,command] of Object.entries(pkg.scripts)) {
    const development=/scripts\/test-/.test(command)||/:test$/.test(name)||name==="ui-scene:fixture"||["pixso:plugin:build","pixso:plugin:build:legacy","pixso:delivery:check","skill:pack","skill:sync"].includes(name);
    if(development) {pkg.scripts[name]="node scripts/maintenance-command.mjs "+name;maintenance.push(name);}
  }
  for (const command of Object.values(pkg.scripts)) for (const match of command.matchAll(/\bnode\s+(scripts\/[^\s]+)/g)) { if (!fs.existsSync(path.join(stage,match[1]))) throw new Error("Missing package command implementation: "+match[1]); }
  fs.writeFileSync(pkgFile,JSON.stringify(pkg,null,2)+"\n");
  const run=(script,extra=[])=>{
    const cp=spawnSync(process.execPath,[path.join(stage,"scripts",script),"--repo",stage,"--skill-root",stage,...extra],{cwd:stage,encoding:"utf8"});
    if(cp.status!==0)throw new Error(script+": "+(cp.stderr||cp.stdout));
  };
  for(const script of ["build-resource-index.mjs","build-skill-catalog-index.mjs","build-navigation-index.mjs"])run(script);
  for(const script of ["build-resource-index.mjs","build-skill-catalog-index.mjs","build-navigation-index.mjs"])run(script,["--check"]);
  const manifest=deliveryManifest(stage);
  fs.writeFileSync(path.join(stage,".delivery-manifest.json"),JSON.stringify(manifest,null,2)+"\n");
  const bytes=selected.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0);
  if(fs.existsSync(out))fs.rmdirSync(out);
  fs.renameSync(stage,out);
  const report={ok:true,profile,out,sourceFiles:files.length,selectedFiles:selected.length,excluded:files.filter(f=>!selected.includes(f)).map(file=>({file,role:deliveryRole(file),bytes:fs.statSync(path.join(root,file)).size})),maintenanceCommands:maintenance,selectedSourceBytes:bytes,sourceBytes:files.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0)};
  console.log(JSON.stringify(report,null,2));
} catch(error) {
  // The staging tree contains only this invocation's own copies.
  fs.rmSync(stage,{recursive:true,force:true});throw error;
}
