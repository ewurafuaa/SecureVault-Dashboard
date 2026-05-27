export default function PropertiesPanel({ file, onClose }) {
  if (!file) {
    return (
      <div className="panel-empty">
        <img src="/folder-details.png" alt="" className="panel-empty-icon" />
        <span className="panel-empty-text">Select a folder to view details here</span>
      </div>
    );
  }

  const isFolder = file.type === "folder";
  const ext = isFolder ? "Folder" : file.name.split(".").pop().toUpperCase();
  const folderCount = isFolder ? file.children?.filter(c => c.type === "folder").length || 0 : 0;
  const fileCount = isFolder ? file.children?.filter(c => c.type === "file").length || 0 : 0;

  return (
    <div className="details-panel">
      <div className="details-header">
        <span className="details-title">{file.name}</span>
        <button className="details-close" onClick={onClose}>✕</button>
      </div>

      <div className="details-icon-wrapper">
        <img
          src={isFolder ? "/folder.png" : "/folder.png"}
          alt=""
          className="details-icon"
        />
      </div>

      <div className="details-section-title">Details</div>
      <div className="details-rows">
        <div className="details-row">
          <span className="details-label">Type</span>
          <span className="details-value">{ext}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Size</span>
          <span className="details-value">{file.size || "—"}</span>
        </div>
        {isFolder && (
          <div className="details-row">
            <span className="details-label">Contains</span>
            <span className="details-value">{folderCount} Folders, {fileCount} Files</span>
          </div>
        )}
        <div className="details-row">
          <span className="details-label">Location</span>
          <span className="details-value details-muted">/{file.name}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Created</span>
          <span className="details-value">{ext}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Created by</span>
          <span className="details-value">You</span>
        </div>
      </div>

      <div className="details-section-title">Quick Actions</div>
      <div className="details-actions-grid">
        <button className="details-action-btn">
          <img src="/star.png" alt="" className="nav-icon" /> Favorite
        </button>
        <button className="details-action-btn">
          <img src="/rename.png" alt="" className="nav-icon" /> Rename
        </button>
        <button className="details-action-btn">
          <img src="/share.png" alt="" className="nav-icon" /> Share
        </button>
        <button className="details-action-btn">
          <img src="/download.png" alt="" className="nav-icon" /> Download
        </button>
      </div>
      <button className="details-action-delete-full">
        <img src="/trash.png" alt="" className="nav-icon" /> Delete
      </button>
    </div>
  );
}