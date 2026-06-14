import { useEffect, useRef } from "react";
import { useGuild } from "../context/GuildContext";
import { Activity, Sparkles } from "lucide-react";

export const TradeFeed = ({ maxheight = "400px" }) => {
  const { feed, totalTradesToday } = useGuild();
  const bottomRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [feed]);

  return (
    <div className="medieval-panel" style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%" }}>
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          borderBottom: "1px double var(--bronze)",
          paddingBottom: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity className="char-bar" size={18} style={{ color: "var(--gold)" }} />
          <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Kingdom Trade Feed</h3>
        </div>
        <div 
          style={{ 
            fontSize: "0.8rem", 
            backgroundColor: "var(--surface-light)", 
            padding: "2px 8px", 
            borderRadius: "4px",
            border: "1px solid var(--bronze)",
            color: "var(--gold)",
            fontFamily: "Cinzel",
            fontWeight: "bold"
          }}
        >
          {totalTradesToday} Trades
        </div>
      </div>

      {/* Auto scrolling feed log list */}
      <div
        style={{
          maxHeight: maxheight,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse", // Newest messages at top, but list itself scrolls. Actually, feed state is unshifted, so index 0 is newest.
          gap: "8px",
          paddingRight: "5px",
          fontFamily: "EB Garamond, serif",
          fontSize: "1.05rem",
          backgroundColor: "rgba(0,0,0,0.4)",
          border: "1px solid var(--bronze-dark)",
          borderRadius: "4px",
          padding: "10px",
          height: "100%",
          minHeight: "200px"
        }}
      >
        <div ref={bottomRef} /> {/* Bottom Anchor */}

        {feed.map((log) => {
          const isReversal = log.message.includes("[REVERSAL]") || log.message.includes("[Reversal]");
          const isTransfer = log.message.includes("[TRANSFER]");
          const isAuction = log.message.includes("[AUCTION");
          const isMarketAlert = log.message.includes("Market Alert");

          let logColor = "var(--text-light)";
          let icon = "📜";

          if (isReversal) {
            logColor = "var(--error-crimson)";
            icon = "⚔️";
          } else if (isTransfer) {
            logColor = "var(--warning-amber)";
            icon = "🏦";
          } else if (isAuction) {
            logColor = "var(--gold)";
            icon = "⚖️";
          } else if (isMarketAlert) {
            logColor = "var(--text-muted)";
            icon = "📈";
          }

          return (
            <div 
              key={log.id} 
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                borderBottom: "1px solid rgba(139, 107, 63, 0.08)",
                paddingBottom: "6px",
                animation: "fadeIn 0.4s ease-out"
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <span 
                  style={{ 
                    fontSize: "0.8rem", 
                    color: "var(--text-muted)", 
                    marginRight: "8px",
                    fontFamily: "Cinzel" 
                  }}
                >
                  [{log.timestamp}]
                </span>
                <span style={{ color: logColor }}>{log.message}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
        <Sparkles size={10} style={{ color: "var(--gold)" }} />
        <span>Live market activity is updated in real time.</span>
      </div>
    </div>
  );
};
