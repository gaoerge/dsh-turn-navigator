<p align="center"><img src="./icon.svg" width="88" height="88" alt="左侧轮次导航图标"></p>

# DSH 左侧轮次导航

![MIT](https://img.shields.io/badge/license-MIT-green) ![DSH target](https://img.shields.io/badge/DSH_target-0.2.1--rc.5-blue)

[English](./README.en.md)

通过 CSS 将 DSH 已有的原生轮次导航移到会话左侧，同时调整预览的位置。沿用原生历史加载、轮次预览、当前轮次状态和键盘操作；本插件不生成另一套导航，不涉及正文虚拟化。

## 适用范围与限制

- 已知目标为 **DSH 0.2.1-rc.5**，清单只声明此版本。没有验证其他版本；发布副本的安装、浏览器实测和截图仍待完成。
- 会话至少需要两轮，由宿主创建原生导航后才能重定位。
- 显示覆盖使用 `@container (width > 480px)`；这是 CSS 容器宽度严格大于 480px，不是整个浏览器视口宽度。较窄容器继续服从宿主显示规则。
- 仅匹配原生 `nav` 的中文 `aria-label="轮次导航"` 或英文 `aria-label="Turn navigation"`；其他语言的无障碍名称不会匹配。
- 依赖 DSH 内部 DOM、容器查询和主题变量。宿主修改导航结构、无障碍名称或布局后可能失效，需要重新核对。此实现是有限范围的原生 CSS 覆盖。
- 卸载或停用时，插件会移除自己创建的样式，布局恢复为宿主当前样式。不会改写会话内容或官方安装文件。

目前没有发布截图；完成真实浏览器验证后可补充，不展示模拟图或失效图片链接。

## 安装

本项目是标准 Cordis 插件包，无构建步骤、无第三方依赖。推荐从 GitHub 安装到实际使用的 profile；下面以 `web` 为例：

```sh
dsh plugin --profile web add "github:gaoerge/dsh-turn-navigator#main"
```

也可以先下载或克隆本仓库，使用其绝对路径安装。将下面的 `your-profile` 和路径换成实际值。

```powershell
dsh plugin --help
dsh plugin --profile your-profile add "D:\plugins\dsh-turn-navigator"
```

上述语法已通过本机 `dsh plugin --help` 核实：`dsh plugin` 把 `add` 等参数转发给 profile 内的 pnpm。该命令添加包；随后在 DSH 插件管理器中检查该 bundle 并启用。若当前实例没有载入新包，按界面提示重启并刷新页面。也可使用 DSH 提供的 bundle 安装入口选择此目录。

保留的包名为 `@local/dsh-turn-navigator`，Loader 行 ID 为 `local-turn-navigator`，Client module ID 为 `@local/dsh-turn-navigator`。若 profile 已经有同名本地插件，请更新已有条目，不要创建第二个导航实例。

## 停用与卸载

先在插件管理器中停用此 bundle，确认宿主原始布局恢复。需要移除包时，在相同 profile 执行：

```powershell
dsh plugin --profile your-profile remove @local/dsh-turn-navigator
```

如界面提示，重启 DSH 并刷新页面。卸载不会删除聊天内容。

## 离线检查

需要本机 Node.js 与 npm，建议 Node.js 22。以下命令不安装依赖，不启动 DSH，也不执行 npm 生命周期脚本：

```powershell
npm run check
npm pack --dry-run --ignore-scripts --json
```

`npm run check` 执行 JavaScript 语法检查与 `scripts/verify.mjs`。校验使用 Node 内置模块检查清单、显式 `exports` / `files`、中英文 meta、SVG 与资源边界，并阻止混入 backup 和实验补丁。打包 dry-run 用于人工核对实际发布文件。离线通过不代表浏览器效果已验证。

## 发布内容

运行文件为 `index.js`、`client.js`、`cordis.patch.yml`，附带清单、原创 SVG 图标、双语 metadata、文档和校验脚本。不包含官方模块备份、`viewport-rendering.js`、`apply-viewport-patch.cjs` 或任何正文虚拟化补丁。

## 许可

代码与本仓库原创图标使用 [MIT License](./LICENSE)，Copyright (c) 2026 gaoerge。
