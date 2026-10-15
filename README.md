# Text to UI Compact

这是从完整 Text-to-UI Skill 复制出来的 HTML 专用版。它保留 HarmonyOS PC 页面规范、三层路由、Blueprint、Pattern、Tokens、HTML 组件复用和 Pixso 流程；页面生成统一走 `@text-to-ui/components-html`。

## 三层路由

1. **工作流路由**：判断是在新建页面、精确修改、导入 Pixso，还是维护组件。非页面任务不强制进入新建页面流程。
2. **任务路由**：对新建或大幅重做页面，根据产品任务选择业务域、Pattern 和初始组件能力；遇到多义任务必须显式选 route ID。
3. **布局 Pattern**：确定窗格、标题区、插槽、滚动和缩放归属；任务路由选定后不得静默改用另一个 Pattern。

三层完成后才查询组件能力索引，并只读取被选组件的契约文件。具体路由表、参数、消歧规则和可复制的 AI 调用卡见 `references/routing-guide.md`。路由资料分别见 `references/routes/index.json`、`references/index/task-routes.source.json`、`references/index/layout-routes.source.json` 和 `assets/design-system/pattern-contracts.json`。三层回答的问题不同，不能互相替代。

## 运行前提

本包内置 HTML 组件源码及其依赖，位置是 `packages/components-html/src/`、`packages/component-contracts/src/`、`packages/component-styles/src/`、`packages/pattern-runtime/src/` 和 `packages/tokens/src/`。49 个组件契约分别保存在 `packages/component-contracts/src/components/<id>.json`，路由索引只保留能力、组件名和文件路径。`components.json` 是脚本兼容用的生成汇总文件，不属于常规路由材料。修改单个契约后运行 `pnpm components:registry:build`，再运行 `pnpm index:build` 更新聚合、组件索引和路由材料索引。组件来自完整 Text-to-UI 仓库的 `c8c0220` 版本；契约只保留 HTML 实现信息。HTML 页面生成使用本目录脚本，本目录同时作为 --repo 和 --skill-root。输出统一为独立组件加动态页面模块；index.html 只作宿主。Gallery 和 Pixso Bridge 等服务仍可能需要完整仓库。

新页面按 `references/routes/new-page.md` 完成需求 Blueprint、Context Packet、Layout Contract、组件绑定、HTML 生成和交互预览。Skill 名称为 `$text-to-ui-compact`；需要其它 Web 输出方式时请使用完整 Text-to-UI Skill。

## 默认页面流程

三层路由 → page-brief.json v2 导航 → 分阶段 task-pack.json 短上下文 → Blueprint/配方/绑定/CSS → 准备独立 components/ 与统一 styles/ → 页面引用组件动态渲染 → 浏览器检查 → 按需导入 Pixso。首次预览也遵守此结构。模型只编写 styles/page-composition.css 中的业务布局；脚本装配标准样式，main.js 统一加载 styles/index.css。详见 references/routes/new-page.md 和 references/components/local-component-delivery.md。

## 维护

以本目录为精简版的维护副本。修改路由或支持资料后，同步更新相关索引与 `.delivery-manifest.json`；不要改动原有完整 Skill。

资料查询与跨模型移交：references/resource-workflow.md。维护时先 resources:build，再 catalog:build、index:build；旧长手册由主题资料生成。
