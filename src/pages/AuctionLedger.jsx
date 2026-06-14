import { useState } from "react";
import { useGuild } from "../context/GuildContext";
import { AuctionTable } from "../components/AuctionTable";
import { Plus, BookOpen } from "lucide-react";
import { ValidationAlert } from "../components/ValidationAlert";

export const AuctionLedger = () => {
  const { auctions, addAuction, cancelAuction, activePlayer } = useGuild();
  const [itemName, setItemName] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [showListingForm, setShowListingForm] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    const price = parseInt(startingPrice);
    if (!itemName.trim()) {
      setValidationError("Please enter an item name.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setValidationError("The price must be a number greater than 0.");
      return;
    }

    if (price > 100000) {
      setValidationError("Price is too high. Max allowed is 100,000 gold.");
      return;
    }

    // Success: add auction to FIFO queue
    addAuction(itemName.trim(), price, activePlayer.name);
    setItemName("");
    setStartingPrice("");
    setShowListingForm(false);
  };

  // Sort queue by active items first (representing the FIFO queue), followed by historical records
  const sortedAuctions = [...auctions].sort((a, b) => {
    if (a.status === "Active" && b.status !== "Active") return -1;
    if (a.status !== "Active" && b.status === "Active") return 1;
    if (a.status === "Active" && b.status === "Active") return a.position - b.position;
    // For non-active, sort by time newest first
    return new Date(b.submissionTime) - new Date(a.submissionTime);
  });

  return (
    <div className="page-container">
      <h2 className="quest-heading">Auctions</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Info panel */}
        <div className="medieval-panel" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <BookOpen size={18} style={{ color: "var(--gold)" }} />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>How Auctions Work</h3>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-muted)" }}>
            Auctions run in order — the first item added is sold first. You can cancel your own auctions at any time.
          </p>
        </div>

        {/* Buttons Row */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {!showListingForm && (
            <button 
              className="btn-fantasy" 
              onClick={() => setShowListingForm(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Plus size={16} />
              <span>Start Auction</span>
            </button>
          )}
        </div>

        {/* Submit Form */}
        {showListingForm && (
          <div className="medieval-panel glowing" style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1.2rem", borderBottom: "1px solid var(--bronze)" }}>
              New Auction — listed as {activePlayer.name}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div className="fantasy-form-group">
                <label htmlFor="auc-item-name">Item Name</label>
                <input
                  type="text"
                  id="auc-item-name"
                  className="fantasy-input"
                  placeholder="E.g., Ancient Elven Amulet"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="auc-item-price">Price (Gold)</label>
                <input
                  type="number"
                  id="auc-item-price"
                  className="fantasy-input"
                  placeholder="0"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {validationError && (
                <ValidationAlert message={validationError} type="error" />
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" className="btn-fantasy" onClick={() => setShowListingForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-fantasy btn-success">
                  Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ledger Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "1.2rem", fontFamily: "Cinzel", margin: 0, color: "var(--gold)" }}>
            All Auctions
          </h3>
          <AuctionTable 
            auctions={sortedAuctions} 
            onCancel={cancelAuction} 
            activePlayerName={activePlayer.name}
          />
        </div>

      </div>
    </div>
  );
};
export default AuctionLedger;
