import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { collectBusinessComponentStyles } from "./prepare-page-styles.mjs";
const root=fs.mkdtempSync(path.join(os.tmpdir(),"tui-business-styles-"));
const bindingsPath=path.join(root,"bindings.json");
const put=(file,text)=>{const f=path.join(root,file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,text);};
const modules=[{compositionId:"results",source:"./page-components/results/index.js",stylesheet:"./page-components/results/styles.css"}];
const write=()=>put("bindings.json",JSON.stringify({pageModules:modules}));
const run=()=>collectBusinessComponentStyles({projectRoot:root,bindingsPath});
try {
 put("styles/page-composition.css","/* page layout */");
 put("page-components/results/index.js","export function mount(host) { host.textContent = 'Results'; }");
 put("page-components/results/styles.css",".results{gap:var(--space-5)}");write();
 const first=run();assert.equal(first.length,1);assert.equal(first[0].ownership,"model-business-component");
 put("page-components/results/styles.css",".results{gap:var(--space-3)}");assert.notEqual(run()[0].sha256,first[0].sha256);
 delete modules[0].stylesheet;write();assert.throws(run,/independent stylesheet/);
 modules[0].stylesheet="./styles/page-composition.css";write();assert.throws(run,/separate .css/);
 modules[0].stylesheet="./page-components/results/styles.css";write();put("page-components/results/styles.css",'@import "./unknown.css";');assert.throws(run,/cannot import/);
 modules[0].stylesheet="../outside.css";write();assert.throws(run,/outside project/);
 put("bindings.json",JSON.stringify({componentBindings:[{logicalName:"Button/Primary/Default"}]}));assert.deepEqual(run(),[]);
 console.log("Existing components need no regenerated CSS; missing business capability requires independent module/style with hashes and boundaries.");
} finally {fs.rmSync(root,{recursive:true,force:true});}
