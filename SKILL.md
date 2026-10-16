---
name: text-to-ui-compact
description: Build HarmonyOS PC HTML pages using three-layer routing, focused stage task packs, canonical Tokens and Patterns, reuse-first components and independent business modules/CSS, dynamic rendering, and a Pixso handoff.
---

# Text to UI Compact

本目录是 RULES_ROOT：独立的 HTML/CSS/JavaScript 技能，含 49 个组件契约、HTML 运行时、Tokens 与 Pattern。HTML 脚本的 --repo 和 --skill-root 均指向本目录。Bridge 与 Preview Hub 使用本包；Gallery 是可选外部服务。Pixso 执行需要当前插件和目标文件连接。

## 固定交付方式

所有 HTML 输出（包括首次预览）使用动态渲染：
- index.html 只保留空 #app 和外部模块入口。
- generated-page.js 引用 components/index.js；组件入口位于 components/<id>/，公共依赖保留在 components/_runtime/。
- generated-entry.js 负责挂载、行为和 __tuiReady。
- main.js 统一导入 styles/index.css；脚本装配已有标准样式；模型写 styles/page-composition.css，缺失能力的业务组件另写 page-components/<id>/index.js 与 styles.css。

固定流程：按需读取 → 查询并判断复用 → 有组件直接引用（脚本复制原实现依赖、建立调用入口，不让模型重写）→ 没有合适组件时生成独立业务组件及其 CSS → 页面动态引用 → 验收。

模型写 Blueprint、内容配方、绑定/行为计划、Token 业务布局。已有组件通过参数和插槽复用；能力缺失先记录 registryQueries、reviewedCandidates、missingCapability，再用 page-composite 配方和 pageModules 声明独立业务模块及 stylesheet。共享组件缺陷走维护流程，不得以自定义近似控件绕过。禁止内联整页控件、重画已登记组件、覆盖组件内部或 Pattern 几何。运行时工厂仍包含公共集中注册代码，不能宣称运行载荷已完全按组件裁剪。

## 三层路由与按需读取

1. Workflow：选择 references/routes/index.json 中的 new-page、micro-revision、existing-html-to-pixso、pixso-component-library、converter-diagnosis 或 skill-maintenance。
2. Task：新建或改变业务结构时，用业务任务确定 references/index/task-routes.source.json 中的唯一 Task route。
3. Pattern：采用该 Task 的布局契约，约束窗格、插槽、滚动与尺寸。

歧义时列候选并明确选择。未知业务必须明确 Pattern 与组件能力；不得静默替换已匹配路由的 Pattern。详见 references/routing-guide.md。

随后按阶段解析资源，这一步不增加路由层数。执行 references/routes/new-page.md 的流程：
intake → design → discovery → bindings → styling → validation → pixso（按需）。

resolve-context.mjs --discover --out <context.json> --brief-out <page-brief.json> 生成机器 Context Packet 和短导航摘要。模型从摘要 v2 取得路由/候选，再领取当前阶段任务包：

~~~bash
node "<RULES_ROOT>/scripts/query-resources.mjs" \
  --stage design --context "<context.json>" --view api --out-dir "<task-pack-dir>"
~~~

读取导出的 task-pack.json 或 task-pack.md 之一。read-plan.json 记录来源、选择原因、依赖闭包和实测字节数。完整 Context Packet、聚合手册、总表与实现源码供脚本使用，普通页面任务不整份读取。

discovery 只给组件名称/用途；读取 bindings 中的组件 API 必须明确 --component <id> --semantic-context <context> 或提供 --bindings <page-bindings.json>，只返回选中 API。按 --interaction 查询相应交互；按 --roles 查询 Token；--mapping 只查所选组件映射。summary 为定位，api 为当前任务参数，full 为诊断完整契约。命令与跨模型移交见 references/resource-workflow.md。

## 生成、验证与 Pixso

新页面按 references/routes/new-page.md 完成四份设计输入并运行 generate-compliant-page.mjs。该脚本验证 Blueprint/配方/语义/Token，准备独立 components/ 和 styles/，生成动态页面，并记录来源；手改受管文件会阻止覆盖。

先执行 page:validate --project <PROJECT_DIR> 检查独立组件、样式、Token 与模块依赖；源码检查不会宣称浏览器通过。打开实际 HTTP 预览，等待 #app.__tuiReady，再检查布局与主要交互。生成、构建、浏览器和视觉结论分别报告；provisional 组件只能按成熟度政策用于预览。

导入 Pixso 时切换 existing-html-to-pixso，按 readiness/capture/compile/publish/readback 阶段领包。输入为同一渲染页面，保留组件/样式清单、component-usage.json 与生成收据。捕获页面后锁定视口和状态，再编译、发布、回读与对比。实例/回退、页面存在、回读与像素差异分别报告；未实际执行不宣称通过。

## 维护

仅维护本精简版目录。references/resources/ 是主题资料的维护源，14 个旧手册路径为兼容聚合产物，不能双份手改。纯标题资源已合并，旧 ID 通过 source.json aliases 指向有效主题。49 个组件契约仍在 packages/component-contracts/src/components/；Token、Pattern、映射 JSON 仍为各自唯一数据源。先检查调用关系再删除资料。

刷新顺序：resources:build → catalog:build → index:build；对应 --check 均通过后刷新 .delivery-manifest.json。缺失、歧义、摘要过期或契约冲突时先修复依赖，不降级绕过。

## 使用包与维护源

本目录可为维护源或 runtime 使用包（见 .compact-distribution.json）。在维护源用 skill:pack --out <空目录> --profile runtime 生成较小使用包；complete 携带开发资料。六条工作流保留，开发命令自动定位匹配维护源，移动包后可设置 TEXT_TO_UI_COMPACT_SOURCE_ROOT。默认不联网取资料。来源、归档及命令边界见 references/distribution.md。
