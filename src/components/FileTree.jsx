import { useMemo } from "react";
import TreeNode from "./TreeNode";

function getMatchingIds(nodes, query) {
  const matched = new Set();
  function walk(node) {
    const nameMatch = node.name.toLowerCase().includes(query.toLowerCase());
    let childMatched = false;
    if (node.children) {
      for (const child of node.children) {
        if (walk(child)) childMatched = true;
      }
    }
    if (nameMatch || childMatched) { matched.add(node.id); return true; }
    return false;
  }
  for (const node of nodes) walk(node);
  return matched;
}

export default function FileTree({ data, onSelect, selectedId, searchQuery }) {
  const matchingIds = useMemo(() => {
    if (!searchQuery?.trim()) return null;
    return getMatchingIds(data, searchQuery);
  }, [data, searchQuery]);

  if (matchingIds && matchingIds.size === 0) {
    return (
      <div className="file-tree-empty">
        <span>No results for "{searchQuery}"</span>
      </div>
    );
  }

  return (
    <div className="file-tree" role="tree">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          onSelect={onSelect}
          selectedId={selectedId}
          matchingIds={matchingIds}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}