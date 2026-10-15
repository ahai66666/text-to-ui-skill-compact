#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { queryResources } from "./stage-context-lib.mjs";
import { resourceSource, loadResourceIndex, aggregateText, json, hash } from "./resource-index-lib.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const temp=fs.mkdtempSync(path.join(os.tmpdir(),"tui-resource-check-"));
const results=[];
const check=(name,fn)=>{ const data=fn(); results.push({name,passed:true,...data}); };
const invoke=(script,args)=> {
  const cp=spawnSync(process.execPath,[path.join(root,"scripts",script),...args],{encoding:"utf8",cwd:root});
  if(cp.status!==0)throw new Error(cp.stderr || cp.stdout);
  return cp;
};
try {
  const source=resourceSource(root);
  check("compatibility aggregates preserve ordered source fragments",()=>{
    for(const doc of source.documents)assert.equal(fs.readFileSync(path.join(root,doc.path),"utf8"),aggregateText(root,source,doc));
    return {documents:source.documents.length};
  });
  const contexts={};
  for(const [task,pattern] of [["设置","pattern-a-two-pane"],["邮箱","pattern-b-three-pane"],["文件管理","pattern-c-tool-workspace"]]) {
    check(task+" three-layer route and staged packets",()=>{
      const context=path.join(temp,pattern+".json"),brief=context+".brief.json";
      invoke("resolve-context.mjs",["--repo",root,"--skill-root",root,"--task",task,"--discover","--out",context,"--brief-out",brief]);
      contexts[task]=context;
      const short=JSON.parse(fs.readFileSync(brief));
      assert.equal(short.schemaVersion,2);assert.equal(short.routes.pattern,pattern);
      assert.equal(short.componentAPI,undefined);assert.equal(short.tokens,undefined);
      const design=queryResources(root,{stage:"design",context});
      assert.equal(design.pack.pattern.id,pattern);
      assert.equal(design.pack.pattern.references,undefined);
      assert.equal(design.pack.components,undefined);
      const otherPatterns=design.pack.resources.filter((v)=>v.id.startsWith("patterns.pattern-")&&!v.id.includes("pattern-"+pattern.split("-")[1]+"-"));
      assert.equal(otherPatterns.length,0);
      assert(design.pack.resources.some((v)=>v.id==="blueprint.required-decisions"));
      const discovery=queryResources(root,{stage:"discovery",context});
      assert(discovery.pack.components.every((c)=>c.props===undefined));
      const binding=queryResources(root,{stage:"bindings",context,component:"button","semantic-context":"page-primary-action"});
      const shared=queryResources(root,{stage:"bindings",context});
      assert(shared.pack.resources.some((r)=>r.id==="composition.plans"));
      assert.equal(shared.pack.components,undefined);
      assert(!binding.pack.resources.some((r)=>r.id.startsWith("composition.")));
      assert.equal(binding.pack.components.length,1);assert(binding.pack.components[0].props.includes("label"));
      assert(binding.pack.components[0].semanticRules.every((v)=>v.context==="page-primary-action"));
      assert.equal(binding.plan.resources.filter((v)=>v.id==="core.delivery").length,1);
      const styling=queryResources(root,{stage:"styling",context,roles:"space/5,color/text,typography.body-m"});
      assert(styling.pack.tokens.some((v)=>v.cssVariable==="--space-5"));
      assert(styling.pack.tokens.some((v)=>v.cssVariable==="--color-text"));
      const validation=queryResources(root,{stage:"validation",context});
      assert(validation.pack.resources.some((v)=>v.id==="validation.preview"));
      return {briefBytes:fs.statSync(brief).size,designPackBytes:design.plan.metrics.modelPackBytes,discoveryPackBytes:discovery.plan.metrics.modelPackBytes,buttonBindingPackBytes:binding.plan.metrics.modelPackBytes,stylingPackBytes:styling.plan.metrics.modelPackBytes};
    });
  }
  check("precise revision omits broad composition guidance",()=>{
    const {pack,plan}=queryResources(root,{stage:"bindings",workflow:"micro-revision",component:"button","semantic-context":"page-primary-action"});
    assert(!pack.resources.some((r)=>r.id.startsWith("composition.")));
    assert.equal(pack.components.length,1);return plan.metrics;
  });
  check("confirmation dialog selects overlays and keyboard",()=>{
    const {pack,plan}=queryResources(root,{stage:"bindings",workflow:"micro-revision",component:"alert-dialog",interaction:"overlay,keyboard"});
    assert(pack.resources.some((r)=>r.id==="interaction.overlay-selection"));
    assert(pack.resources.some((r)=>r.id==="interaction.keyboard-and-focus"));
    assert(!pack.resources.some((r)=>r.id==="supplement.form-composition"));
    return plan.metrics;
  });
  check("Pixso stage filters and canonical component mapping",()=>{
    for(const phase of ["readiness","capture","compile","publish","readback","diagnosis"]) {
      const result=queryResources(root,{stage:"pixso",phase,view:"api"});
      assert(result.pack.resources.some((v)=>v.id==="pixso.invariants"));
      const scoped=result.pack.resources.filter((v)=>v.id.startsWith("pixso-pipeline."));
      assert(scoped.length || phase==="diagnosis");
      if(phase==="readiness")assert(!result.pack.resources.some((v)=>v.id==="pixso-pipeline.execute-transactionally"));
      if(phase==="publish")assert(!result.pack.resources.some((v)=>v.id==="pixso-pipeline.capture-browser-computed-evidence"));
    }
    const mapped=queryResources(root,{stage:"pixso",phase:"compile",component:"button",mapping:true,view:"summary"});
    assert(mapped.pack.mappings.length>0);assert(mapped.pack.mappings.every((m)=>m.htmlRendererKey==="button"));
  });
  check("ambiguity, missing resources, unknown selectors, conflict and budget fail closed",()=>{
    assert.throws(()=>queryResources(root,{stage:"bindings",capabilities:"select"}),/Ambiguous/);
    assert.throws(()=>queryResources(root,{stage:"bindings",component:"button"}),/Semantic context required/);
    assert.throws(()=>queryResources(root,{stage:"bindings",component:"button","semantic-context":"wrong"}),/mismatch/);
    assert.throws(()=>queryResources(root,{stage:"bindings",resource:"missing.topic"}),/Missing resource/);
    assert.throws(()=>queryResources(root,{stage:"pixso",phase:"made-up"}),/Unknown Pixso/);
    assert.throws(()=>queryResources(root,{stage:"design",context:contexts["设置"],pattern:"pattern-b-three-pane"}),/conflicts/);
    assert.throws(()=>queryResources(root,{stage:"bindings",resource:"composition.plans","max-bytes":1}),/exceeds/);
    const exact=queryResources(root,{stage:"discovery",component:"select",view:"summary"});assert.equal(exact.pack.components[0].id,"select");
    const searched=queryResources(root,{search:"scrolling",view:"summary"});
    assert(searched.pack.searchResults.some((r)=>r.id==="patterns.scrolling"));
    assert.equal(searched.pack.resources.length,1);
    const full=queryResources(root,{stage:"bindings",resource:"component.button","semantic-context":"page-primary-action",view:"full"});
    assert.equal(full.pack.components[0].contract.id,"button");
    const intake=queryResources(root,{stage:"intake",task:"邮箱和文件管理",view:"summary"});assert.equal(intake.pack.routeResolution,"ambiguous");
  });
  check("exported JSON, Markdown and read plan agree",()=>{
    const output=path.join(temp,"export");
    invoke("query-resources.mjs",["--stage","bindings","--workflow","micro-revision","--component","button","--semantic-context","page-primary-action","--out-dir",output]);
    const bytes=fs.readFileSync(path.join(output,"task-pack.json"));
    const plan=JSON.parse(fs.readFileSync(path.join(output,"read-plan.json")));
    assert.equal(hash(bytes),plan.taskPackSha256);
    assert.equal(bytes.length,plan.metrics.modelPackBytes);
    assert(fs.readFileSync(path.join(output,"task-pack.md"),"utf8").includes(bytes.toString()));
  });
  check("stale, missing, corrupted and cyclic temporary resources fail closed",()=>{
    const shadow=path.join(temp,"shadow");fs.mkdirSync(shadow);
    const index=loadResourceIndex(root);
    for(const file of [...index.sources.map((v)=>v.path),"references/index/generated/resource-index.json"]) {
      fs.mkdirSync(path.dirname(path.join(shadow,file)),{recursive:true});fs.copyFileSync(path.join(root,file),path.join(shadow,file));
    }
    const part="references/resources/core/delivery.md", file=path.join(shadow,part),saved=fs.readFileSync(file);
    fs.appendFileSync(file,"changed");assert.throws(()=>loadResourceIndex(shadow),/Stale/);
    fs.writeFileSync(file,saved);fs.rmSync(file);assert.throws(()=>loadResourceIndex(shadow),/ENOENT/);fs.writeFileSync(file,saved);
    const idx=path.join(shadow,"references/index/generated/resource-index.json");
    const modified=JSON.parse(fs.readFileSync(idx));modified.resources[0].purpose="corrupt";fs.writeFileSync(idx,json(modified));
    assert.throws(()=>loadResourceIndex(shadow),/metadata drift/);
    const manifest=path.join(shadow,"references/resources/source.json"),meta=JSON.parse(fs.readFileSync(manifest));
    meta.resources[0].requires=["missing.dependency"];fs.writeFileSync(manifest,json(meta));
    assert.throws(()=>resourceSource(shadow),/Missing resource dependency/);
    meta.resources[0].requires=[meta.resources[0].id];fs.writeFileSync(manifest,json(meta));
    assert.throws(()=>resourceSource(shadow),/cycle/);
  });
  console.log(json({ok:true,tests:results.length,results}));
} finally {fs.rmSync(temp,{recursive:true,force:true});}
