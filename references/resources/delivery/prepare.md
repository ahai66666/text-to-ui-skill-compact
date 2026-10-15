## 两阶段命令

一键生成器会自动完成下面的组件准备。需要先交给另一个模型继续写页面时，也可以显式执行：

~~~bash
node "<RULES_ROOT>/scripts/prepare-page-components.mjs" \
  --project "<PROJECT_DIR>" --context "<PROJECT_DIR>/.text-to-ui/context-packet.json" \
  --bindings "<PROJECT_DIR>/page-bindings.json" --skill-root "<RULES_ROOT>"
~~~

省略 --bindings 时，准备 Context Packet 当前选定的组件；提供 --bindings 时，仅准备实际绑定的组件。后续新增组件先重新解析能力，再重跑准备脚本。重复运行只更新自己的清单文件；遇到已被手改的管理文件会停止。

用同一参数加 --check 可检查依赖是否丢失或发生改动。生成器在组件准备和最终生成时核对材料与来源；来源变化后重新解析路由，修正输入再生成。

