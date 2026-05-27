# SecureVault Dashboard
 
A modern, high-performance file explorer interface built for SecureVault Inc.,  an enterprise cloud storage platform serving law firms and financial institutions. This project combines design systems thinking with recursive data structures and keyboard-first accessibility.
 
## Design File

The design file includes a dedicated Design System page covering the full color palette, typography scale, spacing grid, component states, and brand guidelines. 

- Figma 
[View Design and Design System](https://www.figma.com/design/3dP61SRt906j1qu1rjVKsC/SecureVault-Dashboard?node-id=242-525&t=IiDsCzAa1AHDpE8V-1)
 
## Repository and Deployment Links

- Repository Link 
[Link](https://github.com/ewurafuaa/SecureVault-Dashboard)

- Deployment Link 
[Link](https://securevault-kappa.vercel.app/)

 
---
 
## Setup
 
```bash
# Clone the repository
git clone https://github.com/ewurafuaa/SecureVault-Dashboard.git
 
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
│   ├── FileTree.jsx         # Search-aware tree root
│   ├── TreeNode.jsx         # Recursive tree node
│   └── PropertiesPanel.jsx  # File/folder details panel
├── data/
│   └── data.json            # Sample file system data
├── App.jsx                  # Root layout, state, navigation
├── App.css                  # Component-level styles
└── index.css                # Global design tokens & resets
```
 
---
 
## Features
 
### Recursive File Tree
 
The sidebar tree consists of one recursive component `TreeNode`. The component renders itself, and if expanded, it renders its children, which are represented as `TreeNode` components as well. No recursion level is hard-coded, meaning that folders nested twice or twenty times deep will be rendered by the very same component without any additional code required.
The tree displays folders only in the sidebar, according to the mental model of such applications as Finder or Windows Explorer, while the content of folders (folders and files) is displayed in the main window when selected.
The state of expansion of the component is managed in the component itself via the `useState` hook.
 
### Search & Filter
 
A query entered in the search bar filters the directory in real-time. The `getMatchingIds` function in `FileTree.jsx` does a complete recursive walk of the data tree. It collects the IDs of folders whose node name matches the query. It also collects the ID of ancestor folders needed to go from the ancestor to the match. This ensures that if a file that is buried three levels deep appears, its parent folders are forced to open up and included in the filtered result.
Matched text is highlighted inline in each TreeNode using a `highlight()` helper that wraps the matching substring with a styled <mark> element.
 
### File Details Panel
 
When a file or folder is selected in the main content area, a Properties Panel opens to the right.   This shows the name, type and size of the item and a computed file path (built by buildPath, a recursive function which walks the data tree and returns the breadcrumb-like complete ancestor path).
This indicates a total number of files it contains and subfolders it contains. The panel UI includes quick action buttons like Favorite, Rename, Share, Download, and Delete, which can be connected to real backend calls.
 
### Breadcrumb Navigation
 
As you go deeper into folder structure, the breadcrumb trail on the topbar updates live. You can click on the segment to return to that particular level of the tree. This is assembled using `buildBreadcrumb`, a different recursive function which rear traces the path from the root of the data tree to the selected node.

### Keyboard Accessibility
 
The file tree and the main content file list are both fully keyboard navigable:
- **Arrow Up / Arrow Down** moves focus between visible items
- **Arrow Right** expands a folder in the tree
- **Arrow Left** collapses a folder in the tree
- **Enter** selects the focused item
Focus management in the tree uses a custom `selectonly` DOM event to separate "move focus to this node" from "toggle expand" — so navigating with arrow keys doesn't accidentally open or close folders.
 
---
 
## Wildcard Feature — Workspaces

One wildcard feature I believe would be the most strategic thing to add: **Workspaces**

File Explorer does have some limitations because it was created based on the idea of accessing data in a read-only manner. You are able to search for and open the file. But when we are talking about business cases like working with a law firm or a bank, one should understand that any file is a part of something bigger; there is always a case, a deal, a client. And the workspace helps users to organize the sets of files related to particular group of people in a certain space.

Users can create a workspace with a custom name, add collaborators via their emails and have an independent place for that particular group to work within. There is a file panel in every workspace which has all the necessary tools such as Upload, Create Folder, Share and Sort.
 
UX-wise, the workspace concept is intentionally modeled after Figma’s team/workspace pattern: the workspaces are located in the side bar, there is an automatically created avatar generated from the initials of the workspace name, and switching to a different workspace via a drop-down menu does not require changing the current view. Workspace creation is achieved in two steps, using a dialog where users specify a workspace name and invite collaborators to join. There is even a “skip” option available for cases when the user doesn’t need it.

This makes a huge commercial difference for SecureVault, which provides services for clients from law firms working in “matters,” banks working in “deals,” and many other similar types of projects. In all these cases, tight access control, clear ownership of the content, and the opportunity to add new people without opening the whole vault are crucial.