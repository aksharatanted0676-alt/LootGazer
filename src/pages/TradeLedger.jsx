import { useGuild } from "../context/GuildContext";
import { TradeLedgerTable } from "../components/TradeLedgerTable";
import { ShieldCheck, Sparkles } from "lucide-react";

export const TradeLedger = () => {
  const { trades, reverseTrade, activePlayer } = useGuild();

  return (
    <div className="page-container">
      <h2 className="quest-heading">Trade History</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Parchment scroll wrap */}
        <div className="parchment-scroll">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ShieldCheck size={20} color="var(--text-dark)" />
            <h3 style={{ fontSize: "1.3rem", margin: 0, border: "none", padding: 0 }}>
              Cancelling a Trade
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-dark)", lineHeight: 1.4 }}>
            You can cancel any completed trade. The gold goes back to the buyer and the item goes back to the seller. All cancellations are logged in the feed.
          </p>
        </div>

        {/* Ledger Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.2rem", fontFamily: "Cinzel", margin: 0, color: "var(--gold)" }}>
              All Trades
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={12} style={{ color: "var(--gold)" }} />
              Active Player: {activePlayer.name}
            </span>
          </div>
          
          <TradeLedgerTable 
            trades={trades} 
            onReverse={reverseTrade} 
            activePlayerName={activePlayer.name}
          />
        </div>

      </div>
    </div>
  );
};
export default TradeLedger;
