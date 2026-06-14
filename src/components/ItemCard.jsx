import { Coins, Eye, ShoppingCart, Gavel } from "lucide-react";

export const ItemCard = ({ item, onSelect, onBuy, onAuction, activePlayerName }) => {
  const { id, name, category, rarity, price, quantity, seller, image } = item;

  const isOwner = seller === activePlayerName;
  const canBuy = quantity > 0;

  return (
    <div className={`item-card-frame rarity-${rarity}`}>
      {/* Rarity Specific Shine Overlay */}
      <div className={`rare-glow-effect ${rarity}`} />
      
      {/* Shimmer sweeping effect on hover */}
      <div className="shimmer-effect" />
      
      {/* Item Icon Image */}
      <div className="item-image-wrapper">
        <span>{image}</span>
        
        {/* Rarity label over image */}
        <span 
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "0.7rem",
            backgroundColor: "rgba(10, 12, 16, 0.85)",
            padding: "2px 6px",
            borderRadius: "4px",
            border: `1px solid var(--rarity-${rarity.toLowerCase()})`,
            color: `var(--rarity-${rarity.toLowerCase()})`,
            fontFamily: "Cinzel",
            fontWeight: "bold"
          }}
        >
          {rarity}
        </span>
        
        {/* Quantity bubble */}
        <span
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            fontSize: "0.75rem",
            backgroundColor: "var(--surface-light)",
            color: "var(--text-light)",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid var(--bronze)"
          }}
        >
          Qty: {quantity}
        </span>
      </div>

      {/* Item Info Content */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
        <div style={{ flex: 1 }}>
          <h3 
            style={{ 
              fontSize: "1.15rem", 
              margin: "0 0 4px 0",
              color: "var(--text-light)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
            }}
          >
            {name}
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <span>{category}</span>
            <span>By: <span style={{ color: "var(--gold)" }}>{seller}</span></span>
          </div>
        </div>

        {/* Pricing Info */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderTop: "1px solid var(--bronze-dark)",
            paddingTop: "8px",
            marginTop: "4px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "Cinzel" }}>Merchant Price</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--gold)", fontWeight: "bold", fontSize: "1.1rem" }}>
              <Coins size={14} />
              <span>{price.toLocaleString()}</span>
            </div>
          </div>

          {isOwner && (
            <span 
              style={{ 
                fontSize: "0.75rem", 
                color: "var(--warning-amber)", 
                fontStyle: "italic",
                border: "1px solid var(--warning-amber-glow)",
                padding: "2px 6px",
                borderRadius: "2px",
                backgroundColor: "rgba(215, 122, 56, 0.05)"
              }}
            >
              Your Listing
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "8px" }}>
          {/* Buy Button */}
          <button
            onClick={() => onBuy(id)}
            disabled={!canBuy}
            className="btn-fantasy btn-success"
            style={{ 
              gridColumn: "span 2",
              padding: "0.45rem 0.5rem", 
              fontSize: "0.8rem",
              justifyContent: "center",
              opacity: canBuy ? 1 : 0.5,
              width: "100%"
            }}
            title={quantity <= 0 ? "Out of stock" : isOwner ? "Purchase this item (Your Listing)" : "Purchase this item"}
          >
            <ShoppingCart size={13} />
            <span>Buy</span>
          </button>

          {/* Inspect / View details */}
          <button 
            onClick={() => onSelect(item)}
            className="btn-fantasy"
            style={{ 
              padding: "0.45rem 0.5rem", 
              fontSize: "0.8rem",
              justifyContent: "center",
              background: "none",
              backgroundColor: "rgba(10, 12, 16, 0.15)",
              borderColor: "var(--bronze)",
              width: "100%"
            }}
            title="Inspect Artifact Stats & History"
          >
            <Eye size={13} />
            <span>Inspect</span>
          </button>

          {/* Add to Auction Button */}
          <button
            onClick={() => onAuction && onAuction(item)}
            className="btn-fantasy"
            style={{ 
              padding: "0.45rem 0.5rem",
              fontSize: "0.8rem",
              justifyContent: "center",
              borderColor: "#A65DFF",
              color: "#A65DFF",
              backgroundColor: "rgba(166,93,255,0.08)",
              width: "100%"
            }}
            title="Add this item to Auction House"
          >
            <Gavel size={13} />
            <span>Auction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
