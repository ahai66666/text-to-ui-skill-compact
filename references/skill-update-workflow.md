# 精简版维护

仅在 compact 维护源修改规则与实现。使用包通过 TEXT_TO_UI_COMPACT_SOURCE_ROOT 定位维护源，不写完整版。

按 routes/skill-maintenance.md 操作。主题文件是文档维护源，兼容手册由脚本生成。涉及契约先构建 registry，再按 resources:build → catalog:build → index:build 更新并检查。交付和归档见 distribution.md。

独立 components/、统一 styles/ 和动态挂载保持不变。页面验收用 page:validate；开发回归、浏览器、Pixso、视觉证据分别记录。只有用户批准的页面可进入 approved-pages。
