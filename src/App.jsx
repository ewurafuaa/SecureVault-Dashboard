import { useState } from "react";
import "./App.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", icon: "/grid.png", label: "Dashboard" },
    { id: "favorites", icon: "/star.png", label: "Favorites" },
    { id: "shared", icon: "/people.png", label: "Shared" },
  ];

  return (
    <div className="app-layout">

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

        <div>
          <div className="sidebar-section-title">WORKSPACES</div>
          <div className="sidebar-recents" />
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
            
            {/* LEFT PANEL — file tree will go here */}
            <div className="panel panel-left">
              <div className="panel-empty">
                <img src="/recents.png" alt="" className="panel-empty-icon"/>
                <span className="panel-empty-text">Recently opened documents appear here</span>
              </div>
            </div>

            {/* RIGHT PANEL — properties will go here */}
            <div className="panel panel-right">
              <div className="panel-empty">
                <img src="/folder-details.png" alt="" className="panel-empty-icon"/>
                <span className="panel-empty-text">Select a folder to view details here</span>
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}