# TAPTIK 交互与视觉设计规范 (Design System)

本文档旨在统一 TAPTIK 平台的视觉识别系统、交互逻辑及组件规范。

---

## 1. 核心色彩体系 (Color Palette)

### 1.1 主色 (Primary)
主色用于核心品牌识别、关键操作（CTA）以及高优先级提示。
- **Primary Base**: `#685FAB` (应用广泛，如 Logo、主按钮、激活态图标)
- **Primary Light**: `#EDEAF2` (用于背景浅色叠加、搜索建议背景)
- **Primary Hover**: `#504886` (用于按钮悬停态)

### 1.2 辅助色 (Secondary / Accent)
- **成功 (Success)**: `#10B981` (Emerald 500) - 用于“已生效”、“成功注入”等。
- **警示 (Warning)**: `#F59E0B` (Amber 500) - 用于“建议安装”、“需优化”等。
- **危险 (Danger)**: `#F43F5E` (Rose 500) - 用于清除数据、退出等负面操作。

### 1.3 中性色 (Neutral / Grays)
- **文本主色**: `#18181B` (Zinc 900) - 用于标题、正文。
- **文本辅助**: `#71717A` (Zinc 500) - 用于描述、元数据。
- **背景主色**: `#FFFFFF` (White) - 核心内容容器背景。
- **背景次色**: `#FBFBFB` / `#FAFAFA` (Zinc 50) - 用于侧边栏、全局页面底衬。
- **边框色**: `#E4E4E7` (Zinc 200) - 统一的轻量分割线。

---

## 2. 字体与排版 (Typography)

### 2.1 字体家族
- **无衬线 (UI/正文)**: `Inter`, `ui-sans-serif`, `system-ui`.
- **等宽 (数据/代码)**: `JetBrains Mono` 或 `ui-monospace`.

### 2.2 比例与字重 (Scales)
- **H1 (页面大标题)**: `text-3xl`, `font-black`, `tracking-tight`.
- **H2 (模块标题)**: `text-xl`, `font-black`, `tracking-tight`.
- **H3 (卡片标题)**: `text-[15px]`, `font-black`.
- **正文**: `text-[14px]`, `font-medium`, `leading-relaxed`.
- **辅助/标签**: `text-[10px]` 或 `text-[11px]`, `font-black`, `uppercase`, `tracking-widest`.

### 2.3 技术元数据 (Technical Metadata)
对于路径、API 名称或系统状态，使用等宽字体配以强调背景：
- **样式**: `font-mono`, `bg-zinc-100`, `px-1.5`, `py-0.5`, `rounded`, `text-zinc-900`.
- **范例**: `exports/`, `merchant_add_plan_note`.

---

## 3. 空间与形状 (Space & Shapes)

### 3.1 圆角规范 (Radius)
TAPTIK 采用“极致圆润”的设计语言，旨在消除工业生产感：
- **核心容器 (如工作台大背景)**: `rounded-[32px]`
- **功能模块 (如仪表盘、任务列表)**: `rounded-[24px]`
- **交互元素 (按钮、Skill 卡片)**: `rounded-2xl` (16px) 或 `rounded-xl` (12px)
- **微小提示 (标签、单选框)**: `rounded-lg` (8px)

### 3.2 布局栅格 (Grid & Layout)
- **侧边栏 (Sidebar)**: 固定宽度 `w-20`，用于一级导航。
- **子侧边栏 (Sub-Sidebar)**: 弹性宽度 `w-64`，用于项目切换。
- **内容主区**: 使用 `flex-1` 填充，内部卡片通常采用 `max-w-5xl` 或 `max-w-6xl` 居中对齐以控制视距。

---

## 4. 核心交互组件 (Core Interactive Components)

### 4.1 项目切换器 (Project Selector)
位于子侧边栏，用于在不同业务场景间切换。
- **激活态**: `bg-[#685FAB]/10`, `text-[#685FAB]`, 左边缘配以 `w-1` 的主色指示条。
- **图标容器**: `w-8 h-8`, `rounded-lg`, 采用 `Hexagon` 图标作为底座。

### 4.2 智能提示菜单 (Mention Menu)
输入 `@` 时触发的 Skill 调用列表。
- **样式**: `absolute`, `bg-white`, `border-zinc-200`, `shadow-xl`, `rounded-xl`。
- **Header**: `bg-zinc-50`, `text-[10px]`, `font-bold`, `text-zinc-400`。

---

## 5. 专项业务组件 (Business Specific Components)

### 5.1 业务链路仪表盘 (Pipeline Health Check)
工作台的核心连通性检查工具。
- **结构**: 三列表格 `grid-cols-[1fr_80px_1fr]`。
- **行反馈**: 悬停时 `hover:bg-white` 且图标容器 `scale-110`。
- **状态语义**:
  - `Filter` (Blue): 蓝海词挖掘。
  - `Layers` (Primary): 内容矩阵生成。
  - `Route` (Amber): 方案路由编排。
  - `Dna` (Emerald): 资产写入。
  - `Target` (Rose): 数据回执归因。
  - `FileIcon` (Zinc): Excel 批量导入。

### 5.2 待办任务清单 (To-do List)
- **结构**: 同样采用三列布局，强调“谁做”与“预估时间”。
- **语义链接**: 底部需配以明确的业务承诺文字，如“三个做完，全流程跑通”。

---

## 6. 特色 AI 引导模式 (AI Guidance Patterns)

### 6.1 Agent 决策建议卡片 (Recommendation Cards)
当 Agent 检测到业务瓶颈或优化点时触发。
- **视觉特征**: 
  - **容器**: `rounded-[32px]`, `border-2`, `p-8`。
  - **背景**: 带有巨型业务图标水印 (`opacity-[0.03]`)。
  - **标签**: 右上角配备“Paid Skill”或“Free”标签。
- **差异化语义**:
  - **付费 (Paid)**: 使用颜色 `#685FAB` 描边，强调“决定性优化”。
  - **免费 (Free)**: 使用锌色虚线边框 (`border-dashed`)，强调“社区资源发现”。

### 6.2 进度与达成感 (Progress & Achievement)
用于展示开发者准入或任务消耗。
- **进度条**: 背景 `bg-zinc-100` 或 `white/10`，填充色使用 `from-[#685FAB] to-emerald-400` 的渐变，并配以 `shimmer` 扫光动效。
- **呼吸灯**: 数据更新处配以 `animate-pulse` 的绿色小圆点。

---

## 7. 图标与语义系统 (Iconography & Semantics)

### 6.1 状态提示 (Status Indicators)
- **Success**: `Check` (Emerald-500)。
- **Warning**: `AlertCircle` (Amber-500)。
- **Error**: `X` (Rose-500)。
- **Coming Soon**: `RotateCw` (Blue-400 + `animate-spin`)。

### 6.2 默认符号 (System Symbols)
- **引擎标识**: `Hexagon` / `Bot`。
- **资产标识**: `FolderIcon` / `FileBox`。
- **设置/管理**: `Settings` / `ShieldCheck`。

