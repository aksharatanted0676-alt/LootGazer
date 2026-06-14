import { RotateCcw } from "lucide-react";

export const TradeLedgerTable = ({ trades, onReverse, activePlayerName }) => {
  return (
    <div className="medieval-table-container">
      <table className="medieval-table">
        <thead>
          <tr>
            <th style={{ width: "100px" }}>ID</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Item</th>
            <th>Gold</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ width: "130px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                No trades found.
              </td>
            </tr>
          ) : (
            trades.map((trade) => {
              const isCompleted = trade.status === "Completed";
              const isReversed = trade.status === "Reversed";
              
              // Only active buyer or seller can trigger reversal (simulating council power or trade agreement)
              const isParticipant = trade.buyer === activePlayerName || trade.seller === activePlayerName;

              return (
                <tr 
                  key={trade.tradeId}
                  style={{
                    backgroundColor: isReversed ? "rgba(166, 43, 43, 0.02)" : "transparent"
                  }}
                >
                  <td style={{ fontWeight: "bold", fontFamily: "MedievalSharp" }}>
                    {trade.tradeId}
                  </td>
                  <td style={{ color: "var(--text-light)" }}>{trade.buyer}</td>
                  <td style={{ color: "var(--text-light)" }}>{trade.seller}</td>
                  <td style={{ fontStyle: "italic", fontWeight: "500" }}>{trade.item}</td>
                  <td style={{ color: "var(--gold)", fontWeight: "bold" }}>
                    {trade.amount.toLocaleString()} Gold
                  </td>
                  <td style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {new Date(trade.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{
                    color: isCompleted ? "var(--rarity-uncommon)" : "var(--error-crimson)",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "0.85rem"
                  }}>
                    {trade.status}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {isCompleted && (
                      <button
                        onClick={() => onReverse(trade.tradeId)}
                        disabled={!isParticipant}
                        className="btn-fantasy btn-danger"
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.75rem"
                        }}
                        title={isParticipant ? "Cancel this trade and return gold/items" : "You must be a participant in this trade to cancel it"}
                      >
                        <RotateCcw size={12} />
                        <span>Cancel</span>
                      </button>
                    )}
                    {isReversed && (
                      <span style={{ fontSize: "0.8rem", color: "var(--error-crimson)", fontStyle: "italic" }}>
                        Cancelled
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
