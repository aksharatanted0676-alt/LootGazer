import { XSquare } from "lucide-react";

export const AuctionTable = ({ auctions, onCancel, activePlayerName }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return { color: "var(--gold)", fontWeight: "bold" };
      case "Completed": return { color: "var(--rarity-uncommon)", opacity: 0.8 };
      case "Cancelled": return { color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.6 };
      case "Expired": return { color: "var(--error-crimson)", opacity: 0.8 };
      default: return {};
    }
  };

  return (
    <div className="medieval-table-container">
      <table className="medieval-table">
        <thead>
          <tr>
            <th style={{ width: "80px", textAlign: "center" }}>#</th>
            <th>Item</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Listed At</th>
            <th>Status</th>
            <th style={{ width: "120px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {auctions.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                No auctions yet.
              </td>
            </tr>
          ) : (
            auctions.map((auction) => {
              const isOwner = auction.seller === activePlayerName;
              const isActive = auction.status === "Active";

              return (
                <tr 
                  key={auction.auctionId} 
                  style={{
                    backgroundColor: isActive ? "rgba(212, 175, 55, 0.03)" : "transparent",
                    transition: "all 0.4s ease"
                  }}
                >
                  <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "MedievalSharp" }}>
                    {isActive ? `#${auction.position}` : "—"}
                  </td>
                  <td style={{ fontWeight: "600", color: isActive ? "var(--text-light)" : "var(--text-muted)" }}>
                    {auction.item}
                  </td>
                  <td>
                    <span style={{ color: isActive ? "var(--gold)" : "var(--text-muted)" }}>{auction.seller}</span>
                  </td>
                  <td style={{ color: "var(--gold)", fontWeight: "bold" }}>
                    {auction.price.toLocaleString()} Gold
                  </td>
                  <td style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {new Date(auction.submissionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td style={getStatusStyle(auction.status)}>
                    {auction.status}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {isActive && (
                      <button
                        onClick={() => onCancel(auction.auctionId)}
                        disabled={!isOwner}
                        className="btn-fantasy btn-danger"
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.75rem"
                        }}
                        title={isOwner ? "Remove your listing" : "You don't own this listing"}
                      >
                        <XSquare size={12} />
                        <span>Cancel</span>
                      </button>
                    )}
                    {!isActive && (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Ended
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
