# 按需资料查询与跨模型任务包

三层仍是 Workflow（操作）→ Task（业务）→ Pattern（布局）。之后的资源解析按阶段、组件、语义、交互或导入阶段选择资料；不增加布局决策层。

## 资料分别放在哪里

| 内容 | 维护源 | 普通模型如何读取 |
| --- | --- | --- |
| 需求、布局、交互、页面组合、Pixso 长说明 | references/resources/<主题>/ 中的小文件 | 按 stage 或 resource ID 查询 |
| 49 个组件契约 | packages/component-contracts/src/components/<id>.json | discovery 看候选，bindings 只取选中 API |
| Token 值与 CSS 变量 | packages/tokens/src/ | --roles 精确查，带别名依赖闭包 |
| Pattern 机器几何 | assets/design-system/pattern-contracts.json | design 仅带当前 Pattern；运行时使用完整契约 |
| HTML/Pixso 对应关系 | assets/design-system/mapping-registry.json | --component <id> --mapping |
| 资源索引与兼容长手册 | references/index/generated/resource-index.json、原手册路径 | 脚本输入，不整份交给模型 |
| 页面标准 CSS、运行时 | 项目 components/_runtime/ 与 styles/ | 脚本复制/装配；模型只编写业务 CSS |

14 份原长手册由 source.json 的有序 parts 聚合，保留原路径、原章节/锚点与调用关系。修改对应主题文件后重建，不同时维护长短两套内容。
小文件中的相对文字引用继承 source.linkBase；references/、packages/、scripts/、assets/ 路径均从 RULES_ROOT 解析。

## 阶段与输入输出

| stage | 最少输入 | 模型工作 / 完成条件 |
| --- | --- | --- |
| intake | --task；可无 context | 明确主任务、硬约束、缺失事实，列出业务候选，未确认的选择不当成结论 |
| design | --context | 当前 Pattern、Blueprint 规范与当前业务域；完成页面信息结构和 Blueprint |
| discovery | --context，或精确 --component / --capabilities | 只有名称、用途、语义候选；选定组件 ID |
| bindings | --context（新页面）；读取 API 加 --component/--semantic-context，或 --bindings | 仅选中 API、对应补充说明；写配方、绑定、组合树、StylePlan/BehaviorPlan |
| styling | --context；--roles 与 --bindings 可选 | 当前布局间距与用到的 Token；只写 styles/page-composition.css |
| validation | --context；--bindings 可选 | 当前模式的生成/检查要求；分别报告脚本、构建、实际浏览器、视觉结果 |
| pixso | --phase；可无新页面 context | 只执行当前阶段，沿用同一 HTTP 页面与当前运行证据 |

--view summary 只定位资源/候选；api 返回本阶段正文和选中参数；full 在选中组件上额外返回完整契约，不读取其他组件。discovery 始终保持候选摘要，进入 bindings 后再读 API。bindings 不选组件时只读共用组合规范；指定组件时只带该组件 API、补充说明与交互规则；传 --bindings 时可一起对照整页组合规范和实际选中 API。

## 可复制命令

RULES_ROOT 为本目录，PROJECT_DIR 为输出项目。context.json 必须是 resolve-context 生成的机器包；page-brief.json v2 仅导航，不能冒充机器包。实际生成继续按 routes/new-page.md，下面命令只查询资料。

~~~bash
# 设计包
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage design --context "<PROJECT_DIR>/.text-to-ui/context-discovery.json" --view api --out-dir "<PROJECT_DIR>/.text-to-ui/packs/design"

# 已有 Blueprint 的组件定位包，可作为下一模型的移交输入
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage discovery --context "<PROJECT_DIR>/.text-to-ui/context-discovery.json" --blueprint "<PROJECT_DIR>/page-blueprint.json" --view summary --out-dir "<PROJECT_DIR>/.text-to-ui/packs/discovery"

# 精确读取一个按钮的页面主操作 API
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage bindings --context "<PROJECT_DIR>/.text-to-ui/context-discovery.json" --component button --semantic-context page-primary-action --view api --out-dir "<PROJECT_DIR>/.text-to-ui/packs/button"

# 按本页真实绑定读取；只按已用能力选择
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage bindings --context "<PROJECT_DIR>/.text-to-ui/context-discovery.json" --bindings "<PROJECT_DIR>/page-bindings.json" --blueprint "<PROJECT_DIR>/page-blueprint.json" --interaction selection,keyboard --view api --out-dir "<PROJECT_DIR>/.text-to-ui/packs/bindings"

# 样式：Token 查询带别名依赖，不装载 Token 总表
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage styling --context "<PROJECT_DIR>/.text-to-ui/context-discovery.json" --roles space/5,color/text --view api --out-dir "<PROJECT_DIR>/.text-to-ui/packs/styling"

# 精确修改不预读页面组合规则
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage bindings --workflow micro-revision --component button --semantic-context page-primary-action --view api

# 确认对话框，自动带弹层与键盘规范；独立资料查询不会生成页面
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage bindings --workflow micro-revision --component alert-dialog --interaction overlay,keyboard --view api

# 先查主题的候选元数据，解决不熟悉资源 ID 的情况
node "<RULES_ROOT>/scripts/query-resources.mjs" --search scrolling --view summary

# 精确主题文件；summary 可取得 ID、路径、用途、摘要
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage bindings --resource composition.plans --view api

# 精确组件映射（JSON 是当前快照；执行前仍须取得 Pixso 当前文档事实）
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage pixso --phase compile --component button --mapping --view summary

# Pixso 按阶段查询；不执行捕获或发布
node "<RULES_ROOT>/scripts/query-resources.mjs" --stage pixso --phase readiness --view api --out-dir "<PROJECT_DIR>/.text-to-ui/packs/pixso-readiness"
~~~

phase 仅允许 readiness、capture、compile、publish、readback、diagnosis。只在用户要求导入时运行外部发布；排错使用 converter-diagnosis，不能反复创建或发布新导入。

支持 --search <主题词>（只列候选元数据；再用 --resource 精确读取）、--component <精确ID>、--capabilities <能力别名>、--semantic-context <语义>、--interaction <逗号分隔交互>、--resource <稳定资料ID>、--roles <角色或CSS变量>、--mapping 和 --max-bytes <正数字节上限>。
组件 ID 精确匹配优先；能力别名有多个候选时列出候选，不能取第一项。比如 --capabilities select 有多个候选，选定后使用 --component native-select。
--resource 表示显式缩小资料集合，依赖仍自动补全；不要用它跳过当前任务的规范。
--max-bytes 超限时报错并建议缩小请求，绝不截断规则。可用 --resource、组件/语义与交互查询进一步聚焦。

## 给 GLM 或其他模型的移交方法

有本地工具的模型执行同一套 Node 脚本，无需 Codex 专用 API。没有本地工具的模型只接收当前任务包和已确认决策，由操作环境执行生成和校验。

每个 --out-dir 导出：
- task-pack.json：机器可读的当前阶段内容。
- task-pack.md：同一内容的 Markdown 包装，与 JSON 二选一阅读。
- read-plan.json：资料 ID、路径、依赖、选择原因、摘要、UTF-8 字节数，不是必读设计内容。

把下列提示连同当前包交给另一模型：

~~~text
请使用附件中的 Text-to-UI 当前阶段任务包。
先读取 card、core.delivery 和 routes，只执行 card.objective 对应阶段。
遵守 Pattern/组件/Token 边界，按 card.writes 输出文件内容。
不清楚的参数请给出精确的 resource/component/semantic-context 查询请求，不预读整个 Skill。
歧义或材料过期时停止依赖步骤，返回具体缺失；不要自造替代组件。
完成后列出生成的输入、已确认决策、下一阶段所需的最小输入。
无工具时不要声称已运行、浏览器已通过或已导入 Pixso。
~~~

阶段切换可带 --blueprint 传已确认的信息关系，--bindings 传本页实际选项。需要重开上下文时，交付当前包、用户任务、已确认决策和相关输入；旧对话不会自动从模型上下文中消失，不能宣称物理文件拆分本身能缩短已读历史。
本地验证仅证明路由/脚本/生成行为；没有实际调用外部 GLM 时不宣称已完成该模型效果评测。

## 维护与检查

新增资料定义 id、purpose、stage、appliesTo、path、requires；source 记录兼容来源。构建器补齐 bytes、sha256，并校验唯一 ID、依赖存在、循环、文件存在和兼容聚合。索引过期、上下文材料变更、Pattern 冲突均阻止查询。
新增主题先填写 resources/source.json；按准确语义设置适用条件，避免所有阶段默认读取。

~~~bash
pnpm resources:build
pnpm catalog:build
pnpm index:build
pnpm resources:check
pnpm catalog:check
pnpm index:check
pnpm resources:test
~~~

最后刷新 .delivery-manifest.json。不得先生成导航再改变其依赖的 catalog。正式组件/Token/Pattern 数据维护继续使用原有脚本与政策，不从新文档复制第二套值。

## 来源与兼容

纯标题资源合并后，旧 ID 由 source.json aliases 解析。readPolicy 为 stage 的资料按条件下发；explicit-query 为明确查询资料，不等于历史垃圾。组件条件只接受正式 ID；能力别名由组件查询器解析，不混进资源选择条件。日期和时间分开读取，标题栏自动带基础与排版限制，组件补充表在 API 视图仅投影所选组件行，full 保留完整原文。

生成后的统一检查：page:validate --project <PROJECT_DIR>。无实际 runtime-evidence 时只报告源码有效、浏览器待验；正式交付保留成熟度和运行证据要求。使用包与维护源详见 distribution.md。

## 组件决策与生成边界

固定顺序：按需读取 → 检索共享组件/项目已有组件 → 有则引用原实现及 CSS → 无则在配方说明缺失原因并创建独立业务组件与样式 → 页面动态引用 → 验收。bindings 包确定标准控件 API，composition.executable-html-business-composites 规定缺失业务能力的 module/stylesheet。不要让模型重新生成已有组件；不要把新业务组件实现塞入 index.html 或页面 CSS。

迁移旧业务模块：为每个 pageModules 条目补充 stylesheet（路径相对 page-bindings.json），把其私有样式从页面 CSS 移到单独文件；重新执行生成器刷新清单。标准组件与其 CSS 不迁移、不重写。新增业务模块不会自动进入共享组件库；后续项目复用时显式引用，晋升共享组件须补契约及验证证据。
