# TapTik Design System & Interaction Requirements

This document outlines the visual standards and interaction patterns for the TapTik application, intended for porting and maintaining the frontend within a Tauri-based environment.

## 1. Global Visual Identity
- **Aesthetic**: Modern, clean, professional, "Enterprise-Grade Neutral".
- **Color Palette**:
  - `Neutral-0` (White): `#FFFFFF` - Primary background.
  - `Neutral-50` (Off-white): `#F9FAFB` - Secondary backgrounds, sidebar.
  - `Neutral-100` to `200`: Borders and dividers.
  - `Neutral-900` (Charcoal): Primary text and heavy accents.
  - `Primary-500` (Red/Pink): `#E63560` - Brand accent color for active states and primary buttons.
  - `Success-500` (Green): Status indicators, "Online" states.
- **Typography**:
  - Primary Font: **Inter**, ui-sans-serif.
  - Mono Font: **JetBrains Mono** (for credits, counts, dates).
  - Weights: Black (900) for titles, Bold (700) for navigation, Medium (500) for body.
- **Shadows**:
  - "Soft Lift": `shadow-sm` for cards.
  - "Floating": `shadow-2xl` with a large blur for popups.

## 2. Navigation Architecture (Left Sidebar)
### Structure
- **Top**: Logo and Project Selector.
- **Middle**: Flexible navigation area (Chat, Knowledge Center, Marketplace).
- **Bottom**: User Profile Area (Stick to bottom).
  - Consists of User Avatar (Initial based), Username, and Status (Plan type).
  - **Quick Tools**: Two persistent icon buttons for "Usage Gauge" and "Settings".
  - **Interactions**:
    - Clicking the Profile name/avatar does not navigate.
    - Clicking `Gauge` (left icon) opens the **Usage Overview Popup**.
    - Clicking `Settings` (right icon) opens the **Settings Menu Popup**.

### Popups (Usage & Settings)
- **Positioning**: Absolute positioning, appearing directly **above** the trigger buttons.
- **Animation**: `motion/react` (AnimatePresence) - Fade and scale transition (initial 0.95 scale, 10px y-offset).
- **Usage Overview**:
  - Displays a segmented progress bar (24 blocks).
  - Shows "Credits remaining" vs "Total" with a clear percentage.
  - Status labels for "Teams Plan" or "Individual".
- **Settings Menu**:
  - Lists categories with icons (Settings, Language, Theme).
  - Divided by thin lines (`border-neutral-100`).
  - Includes common links (Help, Update Log, Support).
  - Footer: "Log Out" with `text-danger-500`.

## 3. AI Sidebar (Sub-Sidebar)
- **Width**: `200px` to `260px` (responsive).
- **Tabs**: Dual-tab system at top ("对话" and "文件").
  - Icons: `MessageSquare` and `Folder`.
  - Active State: `Neutral-900` text with a `Primary-500` bottom border line (2px).
- **File Tab Header**: Includes project name (Black weight) and a set of utility icons (`Plus`, `FolderPlus`, `RotateCw`, `ExternalLink`).
- **File Tree Interactions**:
  - **Folders**: `ChevronRight` (neutral-400) + solid yellow `Folder` (amber-400 + fill).
  - **Files**: Solid blue `FileEdit`.
  - **Typography**: `Inter` Bold, size `14px`, text `neutral-700`.
  - **Hover**: Subtle `bg-neutral-50` and rounded corners (`rounded-lg`).

## 4. AI Chat Interface (Main Workspace)
### Input Console (Floating Input)
- **Design**: Rounded (20px), border (neutral-200), background (white), shadow-xl.
- **Interactions**:
  - **Textarea**: Auto-expanding height (min 72px).
  - **Placeholder**: "输入你的需求... （@ 引用上下文 · Ctrl+V 粘贴图片）".
  - **Skill Trigger (`@`)**: Shows a popup menu to select available Skills/Engines.
  - **Command Trigger (`/`)**: Shows a popup for system commands.
  - **Model Selector & Hints**: Left side of the input footer. Displays current model (e.g., DeepSeek V4 Pro) in a neutral-0/50 pill and includes middle-dot separated hints: "Enter 发送" and "Shift+Enter 换行".
  - **Utility Icons**: Right side footer includes "Formatting" (AlignLeft), "Enhance Prompt" (Sparkles), and "Voice Input" (Mic).
  - **Send Button**: Right side, dark primary (Neutral-900), active only when text exists.

### Shortcuts Room
- Below the input console, a grid of "Shortcut Categories" (Content, Strategy, etc.) allowing quick insertion of prompt templates.
- **Badges**: Items may have "已挂载" (Installed) or AI Recommended indicators.

## 5. Knowledge Center (File Manager)
- **View Modes**:
  - **Project Directory**: Tree-based view of local files.
  - **Knowledge Library**: Corporate level global assets.
- **Specific Tabs**:
  - **Repo Wiki**: Documentation view.
  - **Memory (记忆)**: Specialized local RAG interface.
    - Features a toggle for "Auto-Generation".
    - Search bar with Filter icon (`SlidersHorizontal`).
    - Chips for active filters (e.g., "成熟度: 高").
    - Content grouped by origin (User, Program, Workspace).

## 6. Billing & Consumption Logic
- **UI Element**: Centralized in the `Billing` view and the `Usage Overview` popup.
- **Credits**: Displayed with 2 decimal precision.
- **Unit**: T-Credits.
- **Logs**: Table-based tracking of agent executions, including timestamps and cost per action.

## 7. Interaction Best Practices (Frontend)
- **Haptic Feedback**: Subtle scale changes on button press (`active:scale-95`).
- **Loading States**: Use "skeleton" style placeholders for content loading rather than full-page spinners.
- **Responsiveness**: All padding should adjust between `p-4` (mobile/small tablet) and `p-8/12` (large desktop).
- **Iframe Constraints**: Avoid using `window.alert` or `window.open`. Use in-app modals and toast notifications for alerts.
