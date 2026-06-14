import { useGuild } from "../context/GuildContext";
import { TradeFeed } from "../components/TradeFeed";
import { RefreshCw } from "lucide-react";

export const KingdomNetwork = () => {
  const { totalTradesToday, addFeedMessage } = useGuild();

  const handleSimulateIncident = () => {
    const events = [
      "⚔️ Tavern Brawl: Sir Galahad argues with Grimnir over Glacial Warhammer durability. Gold prices steady.",
      "📦 Caravan Alert: A guild shipment of Elixirs has arrived from the Southern Ports.",
      "🔔 Royal Decree: Tax collectors announce 0% tariffs on epic armor trade for the next moon.",
      "💍 Relic Discovery: An apprentice unearthed a Cursed Ring of Midas in the whispering catacombs.",
      "🐺 Beast Alert: Wild wolves spotted near trade routes; guards advise carrying protective shields."
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    addFeedMessage(randomEvent);
  };

  return (
    <div className="page-container">
      <h2 className="quest-heading">Kingdom Feed</h2>

      <div className="kingdom-network-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" }}>
        
        {/* Full-size Feed */}
        <div style={{ height: "100%" }}>
          <TradeFeed maxheight="550px" />
        </div>

        {/* Info panel sidebar */}
        <div className="kingdom-network-sidebar" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Magical Broadcaster Panel */}
          <div className="medieval-panel">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--gold)" }}>
              How the Feed Works
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
              This feed updates automatically with live trade events, price changes, and market activity.
            </p>
          </div>

          {/* Manual Simulator triggers (Excellent for testing!) */}
          <div className="medieval-panel" style={{ borderStyle: "dashed" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--warning-amber)" }}>
              Add a Test Event
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
              The feed updates every 12 seconds. Click the button below to add a random event now.
            </p>
            <button
              onClick={handleSimulateIncident}
              className="btn-fantasy"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <RefreshCw size={14} />
              <span>Add Event</span>
            </button>
          </div>

          {/* Active Counters */}
          <div className="medieval-panel" style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Trades This Session
            </span>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--gold)", fontFamily: "MedievalSharp" }}>
              {totalTradesToday}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--success-emerald)", fontWeight: "bold" }}>
              ● Live
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
export default KingdomNetwork;
