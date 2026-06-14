import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import {
  calcTotalGoldCirculation,
  formatTimeAgo,
  fmt,
} from "../utils/economy";
import { Activity } from "lucide-react";

export const LiveEconomyStatus = () => {
  const { players, globalEvents, auctions } = useGuild();

  const totalGold = useMemo(
    () => calcTotalGoldCirculation(players),
    [players]
  );

  const tradesCount = useMemo(
    () =>
      globalEvents.filter(
        (e) => e.type === "PURCHASE" || e.type === "SALE"
      ).length,
    [globalEvents]
  );

  const transfersCount = useMemo(
    () => globalEvents.filter((e) => e.type === "TRANSFER").length,
    [globalEvents]
  );

  const activeAuctions = useMemo(
    () => auctions.filter((a) => a.status === "Active").length,
    [auctions]
  );

  const lastEvent = globalEvents[0];
  const lastUpdated = lastEvent
    ? formatTimeAgo(lastEvent.timestamp)
    : "No events yet";

  const rows = [
    { label: "Gold Circulation", value: `${fmt(totalGold)}g`, color: "var(--gold)" },
    { label: "Trades", value: tradesCount, color: "#3CE2E2" },
    { label: "Transfers", value: transfersCount, color: "#5BB75B" },
    { label: "Active Auctions", value: activeAuctions, color: "#A65DFF" },
    { label: "Last Updated", value: lastUpdated, color: "var(--text-muted)" },
  ];

  return (
    <div
      className="glass-card"
      style={{ padding: "1.5rem", minWidth: "220px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--bronze-dark)",
        }}
      >
        {/* Pulsing dot */}
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#5BB75B",
            boxShadow: "0 0 6px #5BB75B",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
        `}</style>
        <Activity size={16} style={{ color: "var(--gold)" }} />
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontWeight: "700",
            fontSize: "0.85rem",
            color: "var(--gold)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Live Economy Status
        </span>
      </div>

      {/* Stats rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: "700",
                color: row.color,
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
