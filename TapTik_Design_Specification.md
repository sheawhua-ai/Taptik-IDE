# TapTik Design System & Interaction Requirements

This document outlines the comprehensive visual standards, interaction patterns, and layout architectures for the TapTik application, intended as a reference for AI code generation (e.g., Codex) for frontend development.

## 1. Global Visual Identity
- **Aesthetic**: Modern, clean, professional, "Enterprise-Grade Neutral".
- **Color Palette**:
  - `Neutral-0` (White): `#FFFFFF` - Primary background.
  - `Neutral-50` (Off-white): `#F9FAFB` - Secondary backgrounds, sidebar.
  - `Neutral-100` to `200`: Borders and dividers.
  - `Neutral-900` (Charcoal): Primary text and heavy accents.
  - `Primary-500` (Red/Pink): `#E63560` or equivalent (we use `#F03E3E` in some places) - Brand accent color for active states and primary buttons.
  - `Success-500` (Green): Status indicators, "Online" states.
  - `Blue-500`: Accent for files and links.
- **Typography**:
  - Primary Font: **Inter**, ui-sans-serif.
  - Mono Font: **JetBrains Mono** (for credits, counts, dates).
  - Weights: Black (900) for titles, Bold (700) for navigation, Medium (500) for body.
- **Shadows**:
  - "Soft Lift": `shadow-sm` for cards.
  - "Floating": `shadow-2xl` with a large blur for popups.
- **Border Radius**:
  - General: `rounded-lg` or `rounded-xl`.
  - Buttons: `rounded-lg` or heavily rounded `rounded-2xl` for main CTA.

## 2. Navigation Architecture (Left Sidebar)
### Structure
- **Collapsible Behavior**: The sidebar can be collapsed to show only icons.
- **Top**: Logo and Project Selector.
- **Middle**: Flexible navigation area (Chat, Knowledge Center, Marketplace). Active state uses `bg-white` and `shadow-sm`, inactive uses hover states.
- **Bottom**: User Profile Area (Stick to bottom).
  - Consists of User Avatar (Initial based), Username, and Status (Plan type).
  - **Quick Tools**: Settings and Usage gauge.
  - **Popups (Usage & Settings)**: Positioned absolute above triggers with framer-motion animations.

### Project & Session Hierarchy
- A "Chat Space" (对话空间) accordion groups projects.
- Projects contain multiple sessions/chats.
- Right-click or "more" (`MoreHorizontal`) menu on projects allows Pin, Open in Explorer, Rename, Archive, Remove.
- Sessions have options to convert to: Merchant Memory, Personal Memory, Draft, Project Plan, Task, Data Board, Material Req, Direction, Archive.

## 3. Project File Panel (Right/Left Split)
- **Component**: `ProjectFilePanel`
- **Location**: Typically to the left of the main conversation area in specific projects.
- **Width**: Adjustable, min 240px, max 460px.
- **Header**: "项目文件" (Project Files) with Plus and More Options buttons (New Folder, Refresh, Open in OS, Show System Files, Change Local Project).
- **File Tree Interactions**:
  - **Folders**: `ChevronRight`/`ChevronDown` + neutral folder icon.
  - **System Files**: Appear faded/opaque.
  - **Selection**: Highlights active file in `bg-[#F2F5F9]`.
  - **Drag and Drop**: Nodes can be dragged into the chat input.

## 4. AI Chat Interface (Main Workspace - Workbench)
### Core Layout
- **Top Header**: Simple with title, optional "项目文件" toggle if applicable.
- **Left Timeline**: Conversation history showing user prompts in a vertical timeline.
- **Middle Area**: Main content/output area (often styled with a radial-gradient background).
- **Floating Input Console**: Fixed at the bottom of the middle area.
  - **Design**: Rounded (20px), background (white), shadow-md/shadow-xl.
  - **Interactions**: Auto-expanding textarea.
  - **Variables / References**: Dragging a file into the input or typing `@` displays references as small chips (e.g. `[资产: 软便避坑爆款首图]`).
  - **Shortcuts**: Slash `/` commands.
  - **Submit Button**: Dark primary (Neutral-900), hover `Primary-500`.
- **Empty State**: Removed icon, only a clean greeting text ("今天需要我帮您做些什么？" or "欢迎入驻，开始构建您的专属品牌诊断") and a subtext description.
- **Onboarding Panel (Right side)**: For new merchants, a persistent panel on the right shows brand profile progress (Brand Tone, Products, Audience, etc.).

## 5. Workflow & Project Center
- **Tabs System**: "策略库" (Strategy), "内容车间" (Content Workshop), "执行任务" (Tasks), "数据大盘" (Data).
- **Merchant Memory Header**: Persistent banner at the top showing the current project and merchant onboarding status.
- **Workflow State**: If the project lacks initialization data, the UI displays a locked state (padlock icon) prompting the user to complete the chat setup first.

## 6. Material Center
- Grid or masonry layout for managing image/video assets.
- Upload modals with drag-and-drop zones.
- Detailed side drawers for material editing and inspection.

## 7. Knowledge Center (Memory)
- **View Modes**:
  - **Project Directory**: Tree-based view of local files.
  - **Knowledge Library**: Corporate level global assets.
  - **Memory (记忆)**: Specialized local RAG interface.
    - Features a toggle for "Auto-Generation".
    - Search bar with Filter icon (`SlidersHorizontal`).
    - Content grouped by origin (User, Program, Workspace).

## 8. Billing & Consumption Logic
- **Credits**: Displayed with 2 decimal precision. Unit: T-Credits.
- **Usage Overview**: Segmented progress bar. Shows "Credits remaining" vs "Total".

## 9. Interaction & Frontend Best Practices
- **Haptic Feedback**: Subtle scale changes on button press (`active:scale-95`).
- **Animations**: `framer-motion` for layout transitions, exit/enter animations (Popups, Drawers, Modals).
- **Drag and Drop**: Active drop zones highlight with dashed borders and distinct colors (e.g., Primary-500 for files, Red/Pink for `@` references).
- **Empty States**: Friendly icons, helpful copy, and clear Call-to-Action buttons.
- **Iframe Constraints**: Avoid `window.alert` or `window.open`. Use in-app modals and toasts.
