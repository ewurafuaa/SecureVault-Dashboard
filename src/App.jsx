import { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [modalStep, setModalStep] = useState(1);
  const [emails, setEmails] = useState(["", "", ""]);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: "dashboard", icon: "/grid.png", label: "Dashboard" },
    { id: "favorites", icon: "/star.png", label: "Favorites" },
    { id: "shared", icon: "/people.png", label: "Shared" },
  ];

  function getInitials(name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function confirmWorkspace() {
    if (!workspaceName.trim()) return;
    const newWorkspace = { id: Date.now(), name: workspaceName.trim() };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspace(newWorkspace);
    closeModal();
  }

  function closeModal() {
    setShowModal(false);
    setModalStep(1);
    setWorkspaceName("");
    setEmails(["", "", ""]);
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

  return (
    <div className="app-layout">

      {/* Modal Overlay --------------------------------------------------------------------------------------------------------------------- */}
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
                    onClick={() => workspaceName.trim() && setModalStep(2)}>
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
                    <button
                      className="modal-add-another"
                      onClick={() => setEmails([...emails, ""])}
                    >
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

      {/* Sidebar -------------------------------------------------------------------------------------------------------------- */}
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
              className={`sidebar-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <img src={item.icon} alt="" className="nav-icon" />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Workspace Section -------------------------------------------------------------------------------------------- */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">WORKSPACE</div>

          {activeWorkspace ? (
            <div className="workspace-selector-wrapper" ref={dropdownRef}>
              <button
                className="workspace-profile-btn"
                onClick={() => setShowWorkspaceDropdown((prev) => !prev)}
              >
                <div className="workspace-avatar">
                  {getInitials(activeWorkspace.name)}
                </div>
                <span className="workspace-name">{activeWorkspace.name}</span>
                <img src="/chevron-down.png" alt="" className="workspace-chevron" />
              </button>

              {showWorkspaceDropdown && (
                <div className="workspace-dropdown">
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className={`workspace-dropdown-item ${activeWorkspace.id === ws.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveWorkspace(ws);
                        setShowWorkspaceDropdown(false);
                      }}
                    >
                      <div className="workspace-avatar workspace-avatar-sm">
                        {getInitials(ws.name)}
                      </div>
                      <span>{ws.name}</span>
                    </div>
                  ))}
                  <div className="workspace-dropdown-divider" />
                  <button
                    className="workspace-dropdown-create"
                    onClick={() => {
                      setShowWorkspaceDropdown(false);
                      setShowModal(true);
                    }}
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

      {/* Right Side ------------------------------------------------------------------------------- */}
      <div className="right-section">
        <header className="topbar">
          <nav className="topbar-center">
            <span className="topbar-nav-link active">
              {activeWorkspace ? activeWorkspace.name : "Dashboard"}
            </span>
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

            {/* Left Panel ------------------------------------------------------------------------ */}
            <div className="panel panel-left">
              {activeWorkspace ? (
                <div className="workspace-panel">

                  {/* Workspace Sidebar ------------------------------------------------------- */}
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

                  {/* Workspace Main Area ----------------------------------------------------- */}
                  <div className="workspace-main">
                    <div className="workspace-toolbar">
                      <button className="toolbar-btn">
                        <img src="/upload.png" alt="" className="nav-icon" />
                        Upload
                      </button>
                      <button className="toolbar-btn">
                        <img src="/create-folder.png" alt="" className="nav-icon" />
                        Create Folder
                      </button>
                      <button className="toolbar-btn">
                        <img src="/share.png" alt="" className="nav-icon" />
                        Share
                      </button>
                      <button className="toolbar-btn toolbar-btn-sort">
                        <img src="/sort.png" alt="" className="nav-icon" />
                        Sort
                      </button>
                    </div>

                    <div className="workspace-main-divider"/>

                    <div className="workspace-table-header">
                      <span className="table-col-name">Name</span>
                      <span className="table-col">Date Modified</span>
                      <span className="table-col">Type</span>
                      <span className="table-col">Size</span>
                    </div>

                    <div className="workspace-main-divider"/>

                    <div className="workspace-empty">
                      <img src="/recents.png" alt="" className="panel-empty-icon" />
                      <span className="panel-empty-text">Workspace documents will appear here</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="panel-empty">
                  <img src="/recents.png" alt="" className="panel-empty-icon" />
                  <span className="panel-empty-text">Recently opened documents appear here</span>
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="panel panel-right">
              <div className="panel-empty">
                <img src="/folder-details.png" alt="" className="panel-empty-icon" />
                <span className="panel-empty-text">Select a folder to view details here</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}