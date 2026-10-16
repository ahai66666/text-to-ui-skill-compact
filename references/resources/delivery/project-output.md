## 项目输出

~~~text
PROJECT_DIR/
  components/
    index.js                    本页可用的组件注册表
    component-manifest.json     选择结果、输入摘要、来源和输出摘要
    package.json                本地 ES module 边界
    button/
      index.js                  调用注册 HTML 工厂的独立入口
      contract.json             此组件的原始契约
    <其他已选组件>/
    _runtime/
      packages/                 共用工厂、Pattern、CSS 与 Token 依赖闭包
  generated-page.js             页面组合与动态 renderGeneratedPage
  generated-entry.js            挂载、事件、组件初始化、截图就绪信号
  page-blueprint.json
  page-content-recipes.json
  page-bindings.json
  styles/
    index.css                   脚本生成的统一样式入口
    base.css                    脚本生成的视口基础样式
    page-composition.css        模型编写的业务容器布局
    style-manifest.json         样式依赖、加载顺序与摘要
  component-usage.json
  html-page-manifest.json
  index.html
  main.js
~~~

components/<id>/index.js 是真实工厂调用适配器，组件 DOM 和内部样式仍来自 Skill 的 HTML 实现。当前组件工厂在公共 index.js 中集中登记，所以公共运行时仍包含共享注册代码。选中组件的入口与契约按需交付；上下文减少不等于运行时已按字节完全拆分。


若检索后没有合适业务组件，另建 page-components/<id>/index.js 与 styles.css；这些是模型拥有的业务模块，与脚本管理的 components/ 分开。已有组件只引用原实现和样式，不重新生成。
