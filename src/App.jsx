import { useState } from "react";
import "./App.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [modalStep, setModalStep] = useState(1);
  const [emails, setEmails] = useState(["", "", ""]);

  const navItems = [
    { id: "dashboard", icon: "/grid.png", label: "Dashboard" },
    { id: "favorites", icon: "/star.png", label: "Favorites" },
    { id: "shared", icon: "/people.png", label: "Shared" },
  ];

  function closeModal() {
    setShowModal(false);
    setModalStep(1);
    setWorkspaceName("");
    setEmails(["", "", ""]);
  }

  return (
    <div className="app-layout">

      {/* MODAL OVERLAY */}
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
                    <button className="modal-skip-btn" onClick={closeModal}>Skip and confirm</button>
                    <button className="modal-confirm-btn" onClick={closeModal}>Confirm</button>
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
              className={`sidebar-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <img src={item.icon} alt="" className="nav-icon" />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-section">
          <div className="sidebar-section-title">WORKSPACES</div>
          <button className="create-workspace-btn" onClick={() => setShowModal(true)}>
            <img src="/add.png" alt="" className="nav-icon" />
            Create Workspace
          </button>
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

        {/* TOPBAR */}
        <header className="topbar">
          <nav className="topbar-center">
            <span className="topbar-nav-link active">Dashboard</span>
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

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="panels-wrapper">
            <div className="panel panel-left">
              <div className="panel-empty">
                <img src="/recents.png" alt="" className="panel-empty-icon" />
                <span className="panel-empty-text">Recently opened documents appear here</span>
              </div>
            </div>
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