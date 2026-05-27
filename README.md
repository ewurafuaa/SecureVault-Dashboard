# SecureVault Dashboard
 
A modern, high-performance file explorer interface built for SecureVault Inc. — an enterprise cloud storage platform serving law firms and financial institutions. This project was built as part of a frontend engineering challenge, combining design systems thinking with recursive data structures and keyboard-first accessibility.
 
## Design File
 
Figma — [View Design System & UI Frames](https://www.figma.com/design/3dP61SRt906j1qu1rjVKsC/SecureVault-Dashboard?node-id=5-2&t=IiDsCzAa1AHDpE8V-1)
 
The design file includes a dedicated Design System page covering the full color palette, typography scale, spacing grid, component states, and brand guidelines. The visual direction is dark-mode first — cyber-secure, precise, and fast.
 
---
 
## Setup
 
```bash
# Clone the repository
git clone https://github.com/your-username/securevault-dashboard.git
cd securevault-dashboard
 
# Install dependencies
npm install
 
# Start the development server
npm run dev
```
 
Requires Node.js 18+. No additional environment variables needed.
 
---
 
## Tech Stack
 
- **React** (Vite)
- **Vanilla CSS** with CSS custom properties — no component libraries used
- **Custom font:** Helvetica Now Display (loaded via `@font-face`)
---
 
## Project Structure
 
```
src/
├── components/
│   ├── FileTree.jsx       # Search-aware tree root
│   ├── TreeNode.jsx       # Recursive tree node
│   └── PropertiesPanel.jsx # File/folder details panel
├── data/
│   └── data.json          # Sample file system data
├── App.jsx                # Root layout, state, navigation
├── App.css                # Component-level styles
└── index.css              # Global design tokens & resets
```
 
---
 
## Features
 
### Recursive File Tree
 
The sidebar tree is built around a single recursive `TreeNode` component. Each node renders itself and, when expanded, maps over its children — calling `TreeNode` again for each one. There's no hardcoded depth limit. A folder with 2 levels of nesting and one with 20 levels are handled identically by the same component with no structural changes.
 
The tree renders folders only in the sidebar (matching the mental model of a file explorer like Finder or Windows Explorer), while the main panel shows the full contents — folders and files — of whatever is currently selected.
 
Expand/collapse state is managed locally inside each `TreeNode` with `useState`, keeping the component self-contained and the parent tree stateless with respect to open/closed state.
 
### Search & Filter
 
A search query entered in the top bar filters the file tree in real time. The logic is handled in `FileTree.jsx` via a `getMatchingIds` function that does a full recursive walk of the data tree, collecting the IDs of any node whose name matches the query, plus the IDs of all ancestor folders needed to reach that match. This ensures that a file buried three levels deep surfaces correctly — its parent folders are forced open and included in the filtered result.
 
Matched text is highlighted inline inside each `TreeNode` using a `highlight()` helper that wraps the matching substring in a styled `<mark>` element.
 
### File Details Panel
 
Clicking any item — file or folder — in the main content area opens a Properties Panel on the right. It displays the item's name, type, size, and a computed file path (built by `buildPath`, a recursive function that walks the data tree and returns the full ancestor chain as a breadcrumb string).
 
For folders, it also shows a count of how many subfolders and direct files it contains. Quick action buttons (Favorite, Rename, Share, Download, Delete) are included in the panel UI, ready to be wired up to real backend calls.
 
### Breadcrumb Navigation
 
As you navigate deeper into the folder structure, the topbar updates with a live breadcrumb trail. Each segment is clickable and will jump you back to that level of the tree. This is built with `buildBreadcrumb`, another recursive function that traces the path from the root of the data tree to the currently selected node.
 
### Keyboard Accessibility
 
The file tree and the main content file list are both fully keyboard navigable:
 
- **Arrow Up / Arrow Down** moves focus between visible items
- **Arrow Right** expands a folder in the tree
- **Arrow Left** collapses a folder in the tree
- **Enter** selects the focused item
Focus management in the tree uses a custom `selectonly` DOM event to separate "move focus to this node" from "toggle expand" — so navigating with arrow keys doesn't accidentally open or close folders.
 
---
 
## Wildcard Feature — Workspaces
 
The one feature the brief didn't ask for, but that I felt was the most strategically valuable addition: **Workspaces**.
 
The problem with a pure file explorer is that it's a read-only mental model. You browse, you find, you open. But in a law firm or a bank, files don't live in isolation — they live in projects. A case. A deal. A client relationship. People need a shared context where a specific team can upload, organise, and work on a set of files together, without that work bleeding into the rest of the vault.
 
Workspaces address exactly that. Users can create a named workspace, invite collaborators by email, and get a dedicated environment that belongs to that group. The workspace has its own file panel with Upload, Create Folder, Share, and Sort controls — a full working area, not just a view.
 
The UX is deliberately inspired by Figma's team/project model: workspaces appear in the sidebar under a dedicated section, they have an auto-generated avatar from the workspace name's initials, and a dropdown lets you switch between multiple workspaces without leaving the current screen. Creating a workspace is a two-step modal flow — name first, then optional collaborator invites — with a progress indicator and a "Skip and confirm" escape hatch, because not every workspace starts as a team effort.
 
For SecureVault's clients, this matters commercially. Law firms work in matters. Banks work in deals. Both involve tight access control, clear ownership, and the ability to bring in specific people without exposing the whole vault. Workspaces give the frontend the structure to support that — and give SecureVault a feature they can sell as a premium tier.
 
---
 
## Design System
 
The full design system lives in the Figma file linked above. The key decisions:
 
**Color** — A single dark blue background (`#091523`) with layered surface values (`#1F2A37`, `#293442`) creates depth without noise. The accent blue (`#165DD3`) is used exclusively for primary actions and active states, keeping it meaningful. Borders (`#3A495A`) are subtle but present — enough to define structure without adding visual weight.
 
**Typography** — Helvetica Now Display across all weights. Clean, modern, and authoritative. The scale runs from 10px labels to 20px modal titles, with 14px as the default body size.
 
**Spacing** — A simple five-step scale (5 / 10 / 20 / 40px) defined as CSS variables. Consistent spacing throughout without needing to count pixels.
 
**Interactions** — Every interactive element has hover, active, and focus states. Transitions are uniformly 150ms ease. Blue glow (`box-shadow: 0 0 20px rgba(37, 99, 235, 0.3)`) is used on primary buttons to reinforce the "cyber-secure" brand quality without going overboard.