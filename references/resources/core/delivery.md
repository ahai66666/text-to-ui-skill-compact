# 每阶段共同约束

HTML 输出使用动态渲染：index.html 为空挂载宿主，generated-page.js 引用 components/index.js，generated-entry.js 负责挂载与行为。
组件由脚本按实际绑定复制到 components/<id>/，共用依赖保留在 components/_runtime/；模型只写 Blueprint、配方、绑定与业务 CSS。
main.js 仅统一导入 styles/index.css；脚本管理标准样式，模型只写 styles/page-composition.css，使用已有 Token，不覆盖组件/Pattern 内部。
Workflow → Task → Pattern 是三层决策；之后的资料查询只解析资源。业务路由约定的 Pattern 不能静默替换。
先设计任务与信息关系，再找真实组件。多义能力返回候选，需要语义上下文；缺失、过期或互相冲突的材料阻止继续。
生成通过不等于浏览器/视觉通过。Pixso 使用同一个实际渲染页面，等待 __tuiReady；导入、真实实例、回读、像素对比单独报告。
