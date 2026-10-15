## HTML computed visual state

`page-data.json` 的 `buttonType` 只表达组件语义，不能单独作为 Pixso 的最终视觉类型。
HTML 经过媒体查询、`display`、`visibility`、尺寸和内容裁剪后，才得到真正显示的按钮。
因此需要在实际 HTML 目标视口下生成 `page-spec.pixso.visualSnapshot`。快照必须是
schemaVersion 2、source 为 `html-live-computed-style`，并携带当前 HTML/CSS 源码的
`htmlSourceFingerprint`。每个动态区域至少记录 `visible`、`labelVisible`、最终 `mode`、
按钮尺寸、前景色、背景色、边框、圆角、内边距和 gap。Scene 编译不再对缺失或过期快照
回退到 page-data；这类输入直接阻断，避免历史快照静默覆盖当前 HTML。

例如 HTML 在窄视口把 `Icon Text Button` 的 label 隐藏并将按钮收缩到图标尺寸时，快照必须写
`mode: "icon"`；Pixso 就会生成 `Icon Button`，而不是保留一个带隐藏文字槽位的
`Icon Text Button`。快照视口只决定响应式显示状态，不改变 1728×1152 的设计画板尺寸。
快照和 HTML 必须来自同一个状态、同一个 CSS 视口；不能用“默认 page-data 类型”替代
计算样式，也不能用截图猜测节点类型。浏览器侧统一使用
`collectHtmlVisualSnapshot(document, { htmlSourceFingerprint, width, height })`，
由 `packages/components-html` 负责读取最终计算样式；Node 侧由
`scripts/html-visual-contract.mjs` 校验源码指纹和字段完整性。

