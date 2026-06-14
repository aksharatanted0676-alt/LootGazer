import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import { fmt, calcMarketplaceVolume } from "../utils/economy";
import { Globe, ExternalLink } from "lucide-react";

const SERVERS = ["Azeroth-1", "ShadowRealm", "DragonPeak", "TitanValley"];

export const GlobalHubSummaryCard = ({ onNavigate }) => {
  const { globalEvents, trades, auctions } = useGuild();

  const activeServers = SERVERS.length;

  const liveEvents = globalEvents.length;

  const goldTraded = useMemo(
    () => calcMarketplaceVolume(globalEvents),
    [globalEvents]
  );

  const tradesToday = useMemo(
    () =>
      trades.filter(
        (t) =>
          t.status === "Completed" &&
          new Date(t.timestamp).toDateString() === new Date().toDateString()
      ).length,
    [trades]
  );

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.75rem",
        marginBottom: "2.5rem",
        position: "relative",
        overflow: "hidden",
        borderColor: "var(--bronze)",
      }}
    >
      {/* Decorative gradient background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle at top right, rgba(215,122,56,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <Globe size={22} style={{ color: "var(--gold)" }} />
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "MedievalSharp, serif",
              fontSize: "1.25rem",
              color: "var(--gold)",
              letterSpacing: "0.05em",
            }}
          >
            Global Trade Hub
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontFamily: "Cinzel, serif",
            }}
          >
            Real-time cross-server economy monitor
          </p>
        </div>
        {/* Live badge */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.68rem",
            fontWeight: "700",
            fontFamily: "Cinzel, serif",
            color: "#5BB75B",
            background: "rgba(91,183,91,0.12)",
            border: "1px solid rgba(91,183,91,0.4)",
            borderRadius: "4px",
            padding: "0.2rem 0.6rem",
            letterSpacing: "0.06em",
          }}
        >
          ● LIVE
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--bronze-dark), transparent)",
          marginBottom: "1.25rem",
        }}
      />

      {/* Metrics row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Active Servers", value: activeServers, color: "#3CE2E2" },
          { label: "Live Events", value: liveEvents, color: "#A65DFF" },
          { label: "Gold Traded", value: `${fmt(goldTraded)}g`, color: "var(--gold)" },
          { label: "Trades Today", value: tradesToday, color: "#5BB75B" },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              textAlign: "center",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.25rem",
                fontSize: "1.4rem",
                fontWeight: "800",
                color: m.color,
                fontFamily: "MedievalSharp, serif",
              }}
            >
              {m.value}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onNavigate && onNavigate("global-trade-hub")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "0.75rem 1rem",
          background: "linear-gradient(135deg, rgba(215,122,56,0.25), rgba(215,122,56,0.12))",
          border: "1.5px solid var(--bronze)",
          borderRadius: "6px",
          color: "var(--gold)",
          fontFamily: "Cinzel, serif",
          fontWeight: "700",
          fontSize: "0.9rem",
          cursor: "pointer",
          letterSpacing: "0.06em",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(215,122,56,0.45), rgba(215,122,56,0.25))";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(215,122,56,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(215,122,56,0.25), rgba(215,122,56,0.12))";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <ExternalLink size={16} />
        View Global Trade Hub
      </button>
    </div>
  );
};
