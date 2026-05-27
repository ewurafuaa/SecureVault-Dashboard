import { useState, useEffect, useRef } from "react";

export default function TreeNode({ node, depth, onSelect, selectedId, matchingIds, searchQuery }) {
  const isFolder = node.type === "folder";
  const isMatch = matchingIds ? matchingIds.has(node.id) : true;
  const forceOpen = matchingIds && isFolder && matchingIds.has(node.id);
  const [isOpen, setIsOpen] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  if (!isMatch) return null;

  const isSelected = selectedId === node.id;
  const isActive = isSelected;

  function handleClick() {
    if (isFolder) setIsOpen((p) => !p);
    onSelect(node);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSelect(node);
      if (isFolder) setIsOpen((p) => !p);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isFolder) setIsOpen(true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isFolder) setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const all = Array.from(document.querySelectorAll(".tree-node-pill"));
      const idx = all.findIndex((el) => el === nodeRef.current);
      if (idx < all.length - 1) {
        const next = all[idx + 1];
        next.focus();
        next.scrollIntoView({ block: "nearest" });
        next.dispatchEvent(new CustomEvent("selectonly", { bubbles: true }));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const all = Array.from(document.querySelectorAll(".tree-node-pill"));
      const idx = all.findIndex((el) => el === nodeRef.current);
      if (idx > 0) {
        const prev = all[idx - 1];
        prev.focus();
        prev.scrollIntoView({ block: "nearest" });
        prev.dispatchEvent(new CustomEvent("selectonly", { bubbles: true }));
      }
    }
  }

  function handleSelectOnly() {
    onSelect(node);
  }

  function highlight(name) {
    if (!searchQuery?.trim()) return name;
    const idx = name.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return name;
    return (
      <>
        {name.slice(0, idx)}
        <mark className="search-highlight">{name.slice(idx, idx + searchQuery.length)}</mark>
        {name.slice(idx + searchQuery.length)}
      </>
    );
  }

  return (
    <div className="tree-node-wrapper">
      <div
        className="tree-node-row"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {/* CHEVRON */}
        <span className="tree-arrow" onClick={(e) => { e.stopPropagation(); setIsOpen((p) => !p); }}>
          {isFolder && (
            <img
              src="/chevron-right.png"
              alt=""
              className="tree-arrow-icon"
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          )}
        </span>

        {/* PILL */}
        <div
          ref={nodeRef}
          className={`tree-node-pill ${isActive ? "tree-node-pill-active" : ""}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onSelectOnly={handleSelectOnly}
          tabIndex={0}
          role="treeitem"
          aria-expanded={isFolder ? isOpen : undefined}
          ref={(el) => {
            nodeRef.current = el;
            if (el) {
              el.addEventListener("selectonly", handleSelectOnly);
              return () => el.removeEventListener("selectonly", handleSelectOnly);
            }
          }}
        >
          <img src="/folder.png" alt="" className="tree-item-icon" />
          <span className="tree-item-name">{highlight(node.name)}</span>
        </div>
      </div>

      {isFolder && isOpen && node.children?.length > 0 && (
        <div className="tree-children" style={{ marginLeft: `${depth * 16 + 7}px` }}>
          {node.children
            .filter((child) => child.type === "folder")
            .map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={0}
                onSelect={onSelect}
                selectedId={selectedId}
                matchingIds={matchingIds}
                searchQuery={searchQuery}
              />
            ))}
        </div>
      )}
    </div>
  );
}