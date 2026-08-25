# TAPTIK IDE 本地实时预览

活动前端已从 `D:\codex文件\Taptik-IDE-main` 接入本工作区。项目使用 React、TypeScript、Tailwind CSS 与 Vite；Codex 修改 `src/` 内的文件后，浏览器会通过 HMR 自动更新。

## 启动

在 PowerShell 中进入项目目录并运行：

```powershell
.\start-preview.ps1
```

然后打开 <http://localhost:5173>。

如需脱离当前终端在后台运行：

```powershell
.\preview-service.ps1 start
.\preview-service.ps1 status
.\preview-service.ps1 stop
```

后台日志保存在 `.tools/preview/`，关闭 Codex 任务不会停止该进程。

项目的 `.codex/hooks.json` 会在 Codex 会话启动或恢复时自动执行 `start`。
第一次启用或修改 Hook 后，需要在 Codex 中检查并信任该 Hook；服务已运行时不会重复启动。

如果已经安装全局 Node.js，也可以直接运行：

```powershell
npm run dev
```

## 常用入口

- 应用入口：`src/main.tsx`
- 主页面：`src/App.tsx`
- 全局样式：`src/index.css`
- 业务组件：`src/components/`
- 页面模块：`src/pages/`
- Vite 配置：`vite.config.ts`

## GitHub 同步

推荐直接在 Codex 聊天窗口输入：

> 把当前修改同步到 GitHub，提交说明：这里填写本次修改内容。

Codex 会检查差异、验证构建、同步远端并完成提交和推送。

需要手动操作时，可使用项目内的 Git 包装脚本：

```powershell
.\git-local.ps1 status
.\git-local.ps1 add -A
.\git-local.ps1 commit -m "描述本次修改"
.\git-local.ps1 pull --rebase origin main
.\git-local.ps1 push origin main
```

如果拉取或变基出现冲突，请先停止推送并交给 Codex 处理。
