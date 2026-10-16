# Text to UI Compact

HarmonyOS PC 的 HTML/CSS/JavaScript 专用 Skill。入口 SKILL.md，名称 $text-to-ui-compact。

流程：Workflow → Task → Pattern → 阶段任务包 → Blueprint/配方/绑定/业务 CSS → 独立组件和样式 → 动态页面 → 浏览器 → 按需 Pixso。

预览和交付均使用空 index.html、独立 components/、generated-page.js、generated-entry.js 和统一 styles/。49 个组件契约逐个存放；模型只读当前阶段，完整机器数据由脚本处理。

参数与移交见 references/resource-workflow.md；页面流程见 references/routes/new-page.md；打包维护见 references/distribution.md。Bridge 可独立启动，Gallery 为可选外部服务。

刷新：resources:build → catalog:build → index:build。用 skill:pack 生成 runtime/complete 包；历史资料不进入默认使用包。

组件策略：先查库和项目已有组件；有则直接引用原实现/样式；无则经配方记录缺失原因，创建独立业务模块和 CSS，再由页面动态引用。详见 references/routes/new-page.md。
