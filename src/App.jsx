import { useState, useRef, useEffect } from "react";
import FileTree from "./components/FileTree";
import PropertiesPanel from "./components/PropertiesPanel";
import sampleData from "./data/data.json";
import "./App.css";

function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function buildBreadcrumb(nodes, targetId, path = []) {
  for (const node of nodes) {
    const newPath = [...path, node];
    if (node.id === targetId) return newPath;
    if (node.children) {
      const found = buildBreadcrumb(node.children, targetId, newPath);
      if (found) return found;
    }
  }
  return null;
}

function getFileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  const icons = {
    pdf: "/pdf.png",
    docx: "/word.png",
    xlsx: "/excel.png",
    png: "/image.png",
    jpg: "/image.png",
    txt: "/text.png",
    yaml: "/text.png",
    svg: "/image.png",
    ttf: "/text.png",
  };
  return icons[ext] || "/file.png";
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeView, setActiveView] = useState("nav"); // "nav" or "workspace"
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [modalStep, setModalStep] = useState(1);
  const [emails, setEmails] = useState(["", "", ""]);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: "dashboard", icon: "/grid.png", label: "Dashboard" },
    { id: "favorites", icon: "/star.png", label: "Favorites" },
    { id: "shared", icon: "/people.png", label: "Shared" },
    { id: "sampledata", icon: "/sample-data.png", label: "Sample Data" },
  ];

  const selectedNode = selectedTreeId ? findNode(sampleData, selectedTreeId) : null;
  const currentItems = selectedNode?.type === "folder" ? (selectedNode.children || []) : [];
  const breadcrumb = selectedTreeId ? buildBreadcrumb(sampleData, selectedTreeId) || [] : [];

  function getInitials(name) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function handleTreeSelect(node) {
    setSelectedTreeId(node.id);
    setSelectedFile(node);
  }

  function handleFileRowClick(item) {
    setSelectedFile(item);
  }

  function handleFileRowDoubleClick(item) {
    setSelectedFile(item);
    if (item.type === "folder") setSelectedTreeId(item.id);
  }

  function confirmWorkspace() {
    if (!workspaceName.trim()) return;
    const newWorkspace = { id: Date.now(), name: workspaceName.trim() };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspace(newWorkspace);
    setActiveView("workspace");
    closeModal();
  }

  function closeModal() {
    setShowModal(false);
    setModalStep(1);
    setWorkspaceName("");
    setEmails(["", "", ""]);
  }

  function handleNavClick(itemId) {
    setActiveNav(itemId);
    setActiveView("nav");
  }

  function handleWorkspaceClick(ws) {
    setActiveWorkspace(ws);
    setActiveView("workspace");
    setShowWorkspaceDropdown(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowWorkspaceDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getTopbarLabel() {
    if (activeView === "workspace" && activeWorkspace) return activeWorkspace.name;
    if (activeNav === "sampledata") return "Sample Data";
    if (activeNav === "favorites") return "Favorites";
    if (activeNav === "shared") return "Shared";
    return "Dashboard";
  }

  return (
    <div className="app-layout">

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create Workspace</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-progress">
              <div className="modal-progress-fill" />
              <div className={modalStep === 2 ? "modal-progress-fill" : "modal-progress-track"} />
            </div>
            {modalStep === 1 && (
              <>
                <div className="modal-body">
                  <label className="modal-label">Workspace Name</label>
                  <input
                    className={`modal-input ${workspaceName.trim() ? "modal-input-filled" : ""}`}
                    type="text"
                    placeholder="Add a name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className={`modal-next-btn ${workspaceName.trim() ? "modal-next-btn-active" : ""}`}
                    onClick={() => workspaceName.trim() && setModalStep(2)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {modalStep === 2 && (
              <>
                <div className="modal-body">
                  <label className="modal-label">Invite collaborators</label>
                  <div className="modal-emails-scroll">
                    {emails.map((email, i) => (
                      <input
                        key={i}
                        className={`modal-input ${email.trim() ? "modal-input-filled" : ""}`}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          const updated = [...emails];
                          updated[i] = e.target.value;
                          setEmails(updated);
                        }}
                      />
                    ))}
                    <button className="modal-add-another" onClick={() => setEmails([...emails, ""])}>
                      Add another
                    </button>
                  </div>
                </div>
                <div className="modal-footer modal-footer-step2">
                  <button className="modal-back-btn" onClick={() => setModalStep(1)}>Back</button>
                  <div className="modal-footer-right">
                    <button className="modal-skip-btn" onClick={confirmWorkspace}>Skip and confirm</button>
                    <button className="modal-confirm-btn" onClick={confirmWorkspace}>Confirm</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/Logo.png" alt="SecureVault Inc." className="sidebar-logo-img" />
        </div>
        <button className="new-btn">
          <img src="/add.png" alt="" className="btn-icon" />
          New
        </button>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeView === "nav" && activeNav === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <img src={item.icon} alt="" className="nav-icon" />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-section">
          <div className="sidebar-section-title">WORKSPACE</div>
          {activeWorkspace ? (
            <div className="workspace-selector-wrapper" ref={dropdownRef}>
              <button
                className={`workspace-profile-btn ${activeView !== "workspace" ? "workspace-profile-btn-inactive" : ""}`}
                onClick={() => {
                  if (activeView !== "workspace") {
                    setActiveView("workspace");
                  } else {
                  setShowWorkspaceDropdown((prev) => !prev);
                  }
                }}
              >
                <div className="workspace-avatar">{getInitials(activeWorkspace.name)}</div>
                <span className="workspace-name">{activeWorkspace.name}</span>
                <img src="/chevron-down.png" alt="" className="workspace-chevron" />
              </button>
              {showWorkspaceDropdown && (
                <div className="workspace-dropdown">
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className={`workspace-dropdown-item ${activeWorkspace.id === ws.id ? "active" : ""}`}
                      onClick={() => handleWorkspaceClick(ws)}
                    >
                      <div className="workspace-avatar workspace-avatar-sm">{getInitials(ws.name)}</div>
                      <span>{ws.name}</span>
                    </div>
                  ))}
                  <div className="workspace-dropdown-divider" />
                  <button
                    className="workspace-dropdown-create"
                    onClick={() => { setShowWorkspaceDropdown(false); setShowModal(true); }}
                  >
                    <img src="/add.png" alt="" className="workspace-icon" />
                    Create Workspace
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="create-workspace-btn" onClick={() => setShowModal(true)}>
              <img src="/add.png" alt="" className="nav-icon" />
              Create Workspace
            </button>
          )}
        </div>
        <div className="sidebar-bottom">
          <div className="storage-card">
            <span className="storage-label">Storage Used</span>
            <div className="storage-bar-track">
              <div className="storage-bar-fill" />
            </div>
            <div className="storage-meta">
              <span>2.34 TB of 10 TB</span>
              <span>23%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <header className="topbar">
          <nav className="topbar-center">
            {activeView === "nav" && activeNav === "sampledata" && breadcrumb.length > 0 ? (
              <div className="breadcrumb">
                <span
                  className="breadcrumb-link"
                  onClick={() => { setSelectedTreeId(null); setSelectedFile(null); }}
                >
                  Sample Data
                </span>
                {breadcrumb.map((node, i) => (
                  <span key={node.id} className="breadcrumb-item">
                    <img src="/chevron-right.png" alt="" className="breadcrumb-sep" />
                    <span
                      className={`breadcrumb-link ${i === breadcrumb.length - 1 ? "breadcrumb-active" : ""}`}
                      onClick={() => handleTreeSelect(node)}
                    >
                      {node.name}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="topbar-nav-link active">{getTopbarLabel()}</span>
            )}
          </nav>
          <div className="topbar-right">
            <div className="search-bar-wrapper">
              <img src="/search.png" alt="search" className="search-icon" />
              <input
                className="search-bar"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="avatar">EQ</div>
            <img src="/chevron-down.png" alt="" className="btn-icon" />
          </div>
        </header>

        <main className="main-content">
          <div className="panels-wrapper">

            {/* LEFT PANEL */}
            <div className="panel panel-left">

              {activeView === "workspace" && activeWorkspace ? (
                /* WORKSPACE EMPTY STATE */
                <div className="workspace-panel">
                  <div className="workspace-sidebar">
                    <div className="workspace-sidebar-header">
                      <div className="workspace-sidebar-title">
                        <img src="/folder-filled.png" alt="" className="nav-icon" />
                        <span>{activeWorkspace.name}</span>
                      </div>
                      <button className="workspace-sub-more">
                        <img src="/more.png" alt="" className="nav-icon" />
                      </button>
                    </div>
                  </div>
                  <div className="workspace-main">
                    <div className="workspace-toolbar">
                      <button className="toolbar-btn">
                        <img src="/upload.png" alt="" className="nav-icon" /> Upload
                      </button>
                      <button className="toolbar-btn">
                        <img src="/create-folder.png" alt="" className="nav-icon" /> Create Folder
                      </button>
                      <button className="toolbar-btn">
                        <img src="/share.png" alt="" className="nav-icon" /> Share
                      </button>
                      <button className="toolbar-btn toolbar-btn-sort">
                        <img src="/sort.png" alt="" className="nav-icon" /> Sort
                      </button>
                    </div>
                    <div className="workspace-main-divider" />
                    <div className="workspace-table-header">
                      <span className="table-col-name">Name</span>
                      <span className="table-col">Date Modified</span>
                      <span className="table-col">Type</span>
                      <span className="table-col">Size</span>
                      <span className="table-col-actions" />
                    </div>
                    <div className="workspace-main-divider" />
                    <div className="workspace-empty">
                      <img src="/recents.png" alt="" className="panel-empty-icon" />
                      <span className="panel-empty-text">Workspace documents will appear here</span>
                    </div>
                  </div>
                </div>

              ) : activeView === "nav" && activeNav === "sampledata" ? (
                /* SAMPLE DATA STATE */
                <div className="workspace-panel">
                  <div className="workspace-sidebar">
                    <div className="workspace-sidebar-header">
                      <div className="workspace-sidebar-title">
                        <img src="/folder-filled.png" alt="" className="nav-icon" />
                        <span>Sample Data</span>
                      </div>
                      <button className="workspace-sub-more">
                        <img src="/more.png" alt="" className="nav-icon" />
                      </button>
                    </div>
                    <FileTree
                      data={sampleData}
                      onSelect={handleTreeSelect}
                      selectedId={selectedTreeId}
                      searchQuery={searchQuery}
                    />
                  </div>
                  <div className="workspace-main">
                    <div className="workspace-toolbar">
                      <button className="toolbar-btn">
                        <img src="/upload.png" alt="" className="nav-icon" /> Upload
                      </button>
                      <button className="toolbar-btn">
                        <img src="/create-folder.png" alt="" className="nav-icon" /> Create Folder
                      </button>
                      <button className="toolbar-btn">
                        <img src="/share.png" alt="" className="nav-icon" /> Share
                      </button>
                      <button className="toolbar-btn toolbar-btn-sort">
                        <img src="/sort.png" alt="" className="nav-icon" /> Sort
                      </button>
                    </div>
                    <div className="workspace-main-divider" />
                    <div className="workspace-table-header">
                      <span className="table-col-name">Name</span>
                      <span className="table-col">Date Modified</span>
                      <span className="table-col">Type</span>
                      <span className="table-col">Size</span>
                      <span className="table-col-actions" />
                    </div>
                    <div className="workspace-main-divider" />
                    <div className="workspace-file-list">
                      {currentItems.length === 0 ? (
                        <div className="workspace-empty">
                          <img src="/recents.png" alt="" className="panel-empty-icon" />
                          <span className="panel-empty-text">
                            {selectedNode
                              ? "This folder is empty"
                              : "Select a folder to view its contents"}
                          </span>
                        </div>
                      ) : (
                        currentItems.map((item, index) => (
                          <>
                            <div
                              key={item.id}
                              className={`file-row ${selectedFile?.id === item.id ? "file-row-selected" : ""}`}
                              onClick={() => handleFileRowClick(item)}
                              onDoubleClick={() => handleFileRowDoubleClick(item)}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  setSelectedFile(item);
                                  if (item.type === "folder") setSelectedTreeId(item.id);
                                } else if (e.key === "ArrowDown") {
                                  e.preventDefault();
                                  const all = document.querySelectorAll(".file-row");
                                  const idx = Array.from(all).findIndex((el) => el === e.currentTarget);
                                  if (idx < all.length - 1) all[idx + 1].focus();
                                } else if (e.key === "ArrowUp") {
                                  e.preventDefault();
                                  const all = document.querySelectorAll(".file-row");
                                  const idx = Array.from(all).findIndex((el) => el === e.currentTarget);
                                  if (idx > 0) all[idx - 1].focus();
                                }
                              }}
                            >
                              <div className="file-row-name">
                                <img
                                  src={item.type === "folder" ? "/folder.png" : getFileIcon(item.name)}
                                  alt=""
                                  className="file-row-icon"
                                />
                                <span>{item.name}</span>
                              </div>
                              <span className="file-row-col">
                                {new Date().toLocaleDateString("en-GB")}{"  "}
                                {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span className="file-row-col">
                                {item.type === "folder" ? "Folder" : item.name.split(".").pop().toUpperCase()}
                              </span>
                              <span className="file-row-col">{item.size || "—"}</span>
                              <button className="file-row-more" onClick={(e) => e.stopPropagation()}>
                                <img src="/more.png" alt="" className="nav-icon" />
                              </button>
                            </div>
                            {index < currentItems.length - 1 && (
                              <div key={`divider-${item.id}`} className="workspace-main-divider" />
                            )}
                          </>
                        ))
                      )}
                    </div>
                    {currentItems.length > 0 && (
                      <>
                        <div className="workspace-main-divider" />
                        <div className="workspace-footer">
                          {currentItems.length} item{currentItems.length !== 1 ? "s" : ""}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              ) : (
                /* DEFAULT EMPTY STATE */
                <div className="panel-empty">
                  <img src="/recents.png" alt="" className="panel-empty-icon" />
                  <span className="panel-empty-text">Recently opened documents appear here</span>
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="panel panel-right">
              <PropertiesPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}