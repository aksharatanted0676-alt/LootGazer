import { useState } from "react";
import { ChevronLeft, X, Swords, Shield, Heart, Coins, Gavel, ShoppingCart, Tag, CheckCircle } from "lucide-react";
import { useGuild } from "../context/GuildContext";

const RARITY_COLORS = {
  Common:    { border: "#6C7D8E", glow: "rgba(108,125,142,0.25)", text: "#8fa0ae" },
  Uncommon:  { border: "#5BB75B", glow: "rgba(91,183,91,0.25)",  text: "#5BB75B" },
  Rare:      { border: "#2F9FFF", glow: "rgba(47,159,255,0.3)",  text: "#2F9FFF" },
  Epic:      { border: "#A65DFF", glow: "rgba(166,93,255,0.3)",  text: "#A65DFF" },
  Legendary: { border: "#D77A38", glow: "rgba(215,122,56,0.4)",  text: "#D77A38" },
};

export const ItemDetailsModal = ({ item, onClose, onBuy, activePlayer, initialShowAuction = false }) => {
  const { auctions, addAuction, trades } = useGuild();
  const [auctionPrice, setAuctionPrice] = useState(item?.price || 100);
  const [showAuctionForm, setShowAuctionForm] = useState(initialShowAuction);
  const [auctionSuccess, setAuctionSuccess] = useState(false);

  if (!item) return null;

  const {
    id, name, category, rarity, price, quantity,
    seller, image, attack, defense, durability, description
  } = item;

  const rarityStyle = RARITY_COLORS[rarity] || RARITY_COLORS.Common;
  const isOwner = seller === activePlayer?.name;

  // Filter trade history for this specific item
  const itemTradeHistory = trades.filter(t => t.item === name).slice(0, 8);

  // Check if item is already in active auction
  const isAlreadyAuctioned = auctions.some(
    a => a.item === name && a.seller === seller && a.status === "Active"
  );

  const canBuy = !isOwner && quantity > 0;

  const handleCreateAuction = (e) => {
    e.preventDefault();
    const parsed = parseInt(auctionPrice);
    if (!parsed || parsed <= 0) return;
    addAuction(name, parsed, activePlayer.name);
    setAuctionSuccess(true);
    setTimeout(() => {
      setAuctionSuccess(false);
      setShowAuctionForm(false);
    }, 1800);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
        padding: "1.5rem",
      }}
    >
      {/* Modal Panel */}
      <div
        className="modal-scroll-content"
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg, #1a2028 0%, #12161a 100%)",
          border: `2px solid ${rarityStyle.border}`,
          boxShadow: `0 0 40px ${rarityStyle.glow}, 0 20px 60px rgba(0,0,0,0.8)`,
          borderRadius: "12px",
          padding: 0,
          overflow: "hidden",
          maxWidth: "760px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          color: "var(--text-light)",
          fontFamily: "'EB Garamond', serif",
        }}
      >
        {/* ─── Sticky Header Bar ─── */}
        <div
          style={{
            background: "rgba(18,22,26,0.97)",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${rarityStyle.border}44`,
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* Back arrow button */}
          <button
            onClick={onClose}
            title="Back to Marketplace"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              background: "rgba(255,255,255,0.05)",
              border: `1.5px solid ${rarityStyle.border}55`,
              borderRadius: "50%",
              color: "var(--text-light)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${rarityStyle.border}22`;
              e.currentTarget.style.borderColor = rarityStyle.border;
              e.currentTarget.style.color = rarityStyle.text;
              e.currentTarget.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = `${rarityStyle.border}55`;
              e.currentTarget.style.color = "var(--text-light)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Rarity badge */}
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.72rem",
              fontWeight: "800",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: rarityStyle.text,
              background: `${rarityStyle.border}18`,
              border: `1px solid ${rarityStyle.border}55`,
              borderRadius: "4px",
              padding: "0.25rem 0.75rem",
            }}
          >
            {rarity} · {category}
          </span>

          {/* X close */}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
              lineHeight: 1,
              borderRadius: "4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--error-crimson)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── Body (Two-Column Compact Split Layout) ─── */}
        <div 
          style={{ 
            padding: "1.25rem 1.5rem", 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "1.25rem", 
            flex: 1 
          }}
        >
          {/* Left Column: Title, Image, Description Lore, Action Buttons */}
          <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Item Title */}
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.6rem",
                fontFamily: "'MedievalSharp', cursive",
                color: "var(--text-light)",
                textShadow: `0 0 20px ${rarityStyle.glow}`,
                margin: 0,
                letterSpacing: "0.04em",
                lineHeight: 1.2,
              }}
            >
              {name}
            </h2>

            {/* ─── Hero Image + Glow Ring ─── */}
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0.25rem auto",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${rarityStyle.glow} 0%, rgba(0,0,0,0.6) 70%)`,
                border: `2px solid ${rarityStyle.border}`,
                boxShadow: `0 0 20px ${rarityStyle.glow}, inset 0 0 15px rgba(0,0,0,0.8)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3.5rem",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Outer pulse ring */}
              <div
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "50%",
                  border: `1px solid ${rarityStyle.border}33`,
                  animation: "pulse-ring 2.5s ease-in-out infinite",
                }}
              />
              <style>{`
                @keyframes pulse-ring {
                  0%, 100% { transform: scale(1); opacity: 0.5; }
                  50% { transform: scale(1.06); opacity: 1; }
                }
              `}</style>
              <span role="img" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.8))" }}>
                {image}
              </span>
            </div>

            {description && (
              <p
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                  lineHeight: 1.4,
                  margin: 0,
                  padding: "0.5rem 0.75rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "6px",
                  borderLeft: `3px solid ${rarityStyle.border}55`,
                }}
              >
                "{description}"
              </p>
            )}

            {/* ─── Action Buttons ─── */}
            {!showAuctionForm ? (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                {/* Buy Button */}
                <button
                  onClick={() => {
                    const success = onBuy(id);
                    if (success) onClose();
                  }}
                  disabled={!canBuy}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: `1.5px solid ${canBuy ? "var(--gold)" : "var(--bronze-dark)"}`,
                    background: canBuy
                      ? "linear-gradient(135deg, rgba(215,122,56,0.35) 0%, rgba(215,122,56,0.15) 100%)"
                      : "rgba(0,0,0,0.2)",
                    color: canBuy ? "var(--gold)" : "var(--text-muted)",
                    cursor: canBuy ? "pointer" : "not-allowed",
                    fontFamily: "'Cinzel', serif",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    transition: "all 0.2s ease",
                    opacity: canBuy ? 1 : 0.5,
                  }}
                  onMouseEnter={e => {
                    if (canBuy) {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(215,122,56,0.55) 0%, rgba(215,122,56,0.3) 100%)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(215,122,56,0.3)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (canBuy) {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(215,122,56,0.35) 0%, rgba(215,122,56,0.15) 100%)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <ShoppingCart size={14} />
                  {isOwner ? "Your Listing" : quantity <= 0 ? "Out of Stock" : "Buy Item"}
                </button>

                {/* Add to Auction Button */}
                <button
                  onClick={() => setShowAuctionForm(true)}
                  disabled={isAlreadyAuctioned}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: `1.5px solid ${isAlreadyAuctioned ? "var(--bronze-dark)" : "#A65DFF"}`,
                    background: isAlreadyAuctioned
                      ? "rgba(0,0,0,0.2)"
                      : "linear-gradient(135deg, rgba(166,93,255,0.25) 0%, rgba(166,93,255,0.1) 100%)",
                    color: isAlreadyAuctioned ? "var(--text-muted)" : "#A65DFF",
                    cursor: isAlreadyAuctioned ? "not-allowed" : "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    transition: "all 0.2s ease",
                    opacity: isAlreadyAuctioned ? 0.5 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!isAlreadyAuctioned) {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(166,93,255,0.45) 0%, rgba(166,93,255,0.2) 100%)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(166,93,255,0.3)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isAlreadyAuctioned) {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(166,93,255,0.25) 0%, rgba(166,93,255,0.1) 100%)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <Gavel size={14} />
                  {isAlreadyAuctioned ? "Auctioned" : "Auction"}
                </button>
              </div>
            ) : (
              /* ─── Auction Form ─── */
              <form
                onSubmit={handleCreateAuction}
                style={{
                  background: "rgba(166,93,255,0.07)",
                  border: "1.5px solid rgba(166,93,255,0.35)",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  marginTop: "auto"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
                  <Gavel size={14} style={{ color: "#A65DFF" }} />
                  <h4 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "0.85rem", color: "#A65DFF" }}>
                    Add to Auction House
                  </h4>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <label
                    htmlFor="auction-price-modal"
                    style={{
                      display: "block",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <Tag size={10} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Starting Bid Price (Gold)
                  </label>
                  <input
                    type="number"
                    id="auction-price-modal"
                    className="fantasy-input"
                    value={auctionPrice}
                    onChange={e => setAuctionPrice(e.target.value)}
                    min="1"
                    required
                    style={{ width: "100%", padding: "0.4rem 0.6rem", fontSize: "0.9rem" }}
                  />
                </div>

                {auctionSuccess ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "0.4rem 0.65rem",
                      background: "rgba(91,183,91,0.15)",
                      border: "1px solid rgba(91,183,91,0.4)",
                      borderRadius: "6px",
                      color: "#5BB75B",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                    }}
                  >
                    <CheckCircle size={14} />
                    Listed in Auction House!
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        border: "1.5px solid #A65DFF",
                        background: "linear-gradient(135deg, rgba(166,93,255,0.4) 0%, rgba(166,93,255,0.2) 100%)",
                        color: "#A65DFF",
                        fontFamily: "'Cinzel', serif",
                        fontWeight: "800",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAuctionForm(false)}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid var(--bronze-dark)",
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text-muted)",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Right Column: RPG Stats, Details Table, Trade History */}
          <div style={{ flex: "1.2 1 300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* ─── RPG Stats Row ─── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1px",
                background: `${rarityStyle.border}33`,
                border: `1.5px solid ${rarityStyle.border}44`,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {[
                { icon: <Swords size={14} />, label: "Attack",     value: attack,        color: "#FF6B6B" },
                { icon: <Shield size={14} />,  label: "Defense",    value: defense,       color: "#3CE2E2" },
                { icon: <Heart size={14} />,   label: "Durability", value: `${durability}%`, color: "#5BB75B" },
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "0.6rem 0.25rem",
                    background: "rgba(18,22,26,0.95)",
                  }}
                >
                  <div style={{ color: stat.color, display: "flex", justifyContent: "center", marginBottom: "0.2rem" }}>
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-muted)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'MedievalSharp', cursive",
                      fontSize: "1.3rem",
                      color: stat.color,
                      textShadow: `0 0 10px ${stat.color}88`,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Item Details Table ─── */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--bronze-dark)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {[
                { label: "Seller",    value: <span style={{ color: "var(--gold)" }}>{seller}</span> },
                {
                  label: "Price",
                  value: (
                    <span style={{ color: "var(--gold)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Coins size={12} />
                      {price.toLocaleString()} Gold
                    </span>
                  )
                },
                {
                  label: "Available",
                  value: (
                    <span style={{ color: quantity > 0 ? "var(--success-emerald)" : "var(--error-crimson)" }}>
                      {quantity > 0 ? `${quantity} in stock` : "Out of Stock"}
                    </span>
                  )
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.55rem 0.75rem",
                    borderBottom: i < 2 ? "1px solid var(--bronze-dark)" : "none",
                  }}
                >
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {row.label}
                  </span>
                  <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ─── Trade History ─── */}
            <div>
              <h3
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.9rem",
                  color: "var(--gold)",
                  borderBottom: "1px solid var(--bronze-dark)",
                  paddingBottom: "0.3rem",
                  marginBottom: "0.4rem",
                  letterSpacing: "0.04em",
                }}
              >
                Trade History
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginLeft: "6px", fontWeight: "400" }}>
                  ({itemTradeHistory.length} records)
                </span>
              </h3>

              {itemTradeHistory.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "0.5rem 0" }}>
                  No trades recorded for this item yet.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxHeight: "115px", overflowY: "auto", paddingRight: "4px" }}>
                  {itemTradeHistory.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.4rem 0.6rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "6px",
                        border: "1px solid var(--bronze-dark)",
                        fontSize: "0.78rem",
                        gap: "0.25rem",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
                        <span style={{ color: "var(--text-light)", fontWeight: "600" }}>{h.buyer}</span>
                        {" "}←{" "}
                        <span style={{ color: "var(--gold)" }}>{h.seller}</span>
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                        <span style={{ color: "var(--gold)", fontWeight: "700" }}>
                          {h.amount.toLocaleString()}g
                        </span>
                        <span
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: "700",
                            fontFamily: "'Cinzel', serif",
                            color: h.status === "Reversed" ? "var(--error-crimson)" : "var(--success-emerald)",
                            background: h.status === "Reversed" ? "rgba(255,77,77,0.12)" : "rgba(60,226,226,0.1)",
                            border: `1px solid ${h.status === "Reversed" ? "rgba(255,77,77,0.3)" : "rgba(60,226,226,0.3)"}`,
                            borderRadius: "4px",
                            padding: "1px 4px",
                          }}
                        >
                          {h.status === "Reversed" ? "Rev" : "Done"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
