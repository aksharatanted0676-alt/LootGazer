import { useState } from "react";
import { Tag, User } from "lucide-react";

export const InventorySearch = ({ items }) => {
  const [query, setQuery] = useState("");

  // Create a combined inventory structure mapping items to players
  // E.g., showing which player owns what item based on items data.
  // Note: we can also create a list of chest cards for all items that are owned/listed in the hall.
  
  // Highlight helper
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return <span>{text}</span>;
    // eslint-disable-next-line no-useless-escape
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="search-highlight">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const filteredItems = items.filter(item => {
    const searchVal = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchVal) ||
      item.category.toLowerCase().includes(searchVal) ||
      item.seller.toLowerCase().includes(searchVal)
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Search Input Panel */}
      <div 
        className="medieval-panel"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "10px", 
          backgroundColor: "rgba(0,0,0,0.3)" 
        }}
      >
        <label 
          htmlFor="inv-search" 
          style={{ 
            fontFamily: "Cinzel", 
            color: "var(--gold)", 
            fontSize: "1.1rem",
            textShadow: "1px 1px 2px black" 
          }}
        >
          Search Inventory (Real-time)
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="inv-search"
            type="text"
            className="fantasy-input"
            placeholder="Search by item name, category, or owner..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "1.1rem"
              }}
            >
              ×
            </button>
          )}
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          Items found: {filteredItems.length}
        </span>
      </div>

      {/* Grid of chests */}
      {filteredItems.length === 0 ? (
        <div 
          className="medieval-panel"
          style={{ 
            textAlign: "center", 
            padding: "3rem", 
            color: "var(--text-muted)", 
            fontStyle: "italic" 
          }}
        >
          No items found matching your search.
        </div>
      ) : (
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`medieval-panel rarity-${item.rarity}`}
              style={{
                marginBottom: 0,
                border: `2px solid var(--rarity-${item.rarity.toLowerCase()})`,
                boxShadow: `inset 0 0 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.4)`
              }}
            >
              {/* Chest visual icon */}
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  borderBottom: "1px solid rgba(139, 107, 63, 0.15)",
                  paddingBottom: "8px",
                  marginBottom: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📦</span>
                  <span style={{ fontFamily: "Cinzel", fontSize: "0.85rem", color: `var(--rarity-${item.rarity.toLowerCase()})` }}>
                    {item.rarity} Chest
                  </span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Quantity: {item.quantity}</span>
              </div>

              {/* Item Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div 
                  style={{ 
                    fontFamily: "Cinzel", 
                    fontSize: "1.1rem", 
                    fontWeight: "bold",
                    color: "var(--text-light)" 
                  }}
                >
                  {highlightText(item.name, query)}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <Tag size={12} />
                  <span>Category: {highlightText(item.category, query)}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <User size={12} />
                  <span>Owner: <span style={{ color: "var(--gold)" }}>{highlightText(item.seller, query)}</span></span>
                </div>
              </div>

              {/* Stats Mini view */}
              <div 
                style={{ 
                  marginTop: "12px", 
                  backgroundColor: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--bronze-dark)",
                  borderRadius: "2px",
                  padding: "4px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem"
                }}
              >
                <span>Attack: <span style={{ color: "var(--gold)" }}>{item.attack}</span></span>
                <span>Defense: <span style={{ color: "var(--gold)" }}>{item.defense}</span></span>
                <span>Durability: <span style={{ color: "var(--gold)" }}>{item.durability}%</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
