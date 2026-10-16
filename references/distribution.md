# 使用包、维护源与兼容材料

compact 维护源保留开发资料；带 .compact-distribution.json 标记的 runtime 使用包保留六条操作入口、业务路由、全部组件契约、页面/样式/Pattern/Token，以及当前 Pixso 导入和诊断执行链。

~~~bash
pnpm skill:pack --out <空目录> --profile runtime
~~~

complete 配置携带全部 compact 维护资料。两种配置均重建和检查索引、生成文件摘要；不复制 node_modules、临时输出、历史快照。

runtime 排除开发测试和预览、旧插件安装包、专项修复、当前插件内重复的宿主服务文件。独立同步插件 main.js 仍是 Unified 构建源；正式运行的 generated/index.js、运行时、契约和 CSS 保留。14 份兼容手册仍是机器校验输入，保留为生成产物，不双份维护。

runtime 的开发命令经 .compact-distribution.json 定位维护源。移动包后设置 TEXT_TO_UI_COMPACT_SOURCE_ROOT；不会联网下载或猜另一份 Skill。缺少维护源时明确缺失；页面生成、验收与当前 Pixso 执行保持本地。库级回归在维护源执行。

Bridge/Preview Hub 可由本包启动。Gallery 为可选服务：设置 TEXT_TO_UI_GALLERY_ROOT 或 TEXT_TO_UI_FULL_REPOSITORY，再执行 services:start --gallery。Pixso 连接和目标文件仍需实际可用。

历史快照与归档在维护源外的 text-to-ui-compact-maintenance/，不作为现行规则加载。

Token 运行投影由 tokens:runtime:build/check 与设计系统映射同步；本次只补齐已有 CSS 中三种图标描边的映射，不修改 CSS、颜色或组件外观。

所有分发配置均排除 assets/icons/harmonyos/；维护源中也不保留 Symbol 目录、字体、元数据或全量预览。图标仅保留组件所需预编译资源、本地勾选/窗口 SVG 和 Token 使用的状态 SVG。外部 Symbol 库由项目管理，Skill 不默认加载，未来重新放入旧目录也不会进入交付清单。
