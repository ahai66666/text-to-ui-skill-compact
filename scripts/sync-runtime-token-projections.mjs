#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const write=process.argv.includes("--write");
if(!write&&!process.argv.includes("--check"))throw new Error("Use --write or --check");
const css=fs.readdirSync(path.join(root,"packages/tokens/src")).filter(f=>f.endsWith(".css")).map(f=>fs.readFileSync(path.join(root,"packages/tokens/src",f),"utf8")).join("\n");
const names=new Set([...css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map(m=>m[1]));
for(const [name,key] of [["token-runtime-map.json","mappings"],["dual-output-token-map.json","variableMappings"],["token-utility-map.json","utilities"]]) {
  const source=path.join(root,"assets/design-system",name),target=path.join(root,"packages/tokens/src",name);
  const current=JSON.parse(fs.readFileSync(target)),canonical=JSON.parse(fs.readFileSync(source));
  if(name!=="token-utility-map.json") {
    const cssKey=name==="token-runtime-map.json"?"cssVariable":"webCssVariable";
    const canonicalRows=new Map(canonical[key].map(row=>[row[cssKey],row]));
    for(const row of current[key])if(JSON.stringify(canonicalRows.get(row[cssKey]))!==JSON.stringify(row))throw new Error("Conflicting existing Token mapping: "+row[cssKey]);
    for(const row of canonical[key])if(!names.has(row[cssKey]))throw new Error("Projection refers to an undeclared runtime CSS variable: "+row[cssKey]);
    if(JSON.stringify(current.semanticRoles||current.semanticTokenMappings)!==JSON.stringify(canonical.semanticRoles||canonical.semanticTokenMappings))throw new Error("Semantic Token projection conflict");
  }
  const text=JSON.stringify(canonical,null,2)+"\n";
  if(write)fs.writeFileSync(target,text);
  else if(fs.readFileSync(target,"utf8")!==text)throw new Error("Runtime Token projection drift: "+name);
}
console.log(JSON.stringify({ok:true,mode:write?"write":"check",policy:"Token projections generated from the design-system maps; CSS remains unchanged"}));
