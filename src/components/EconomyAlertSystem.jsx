import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import { AlertTriangle } from "lucide-react";

const HIGH_VALUE_TRADE_THRESHOLD = 50000;
const HIGH_VALUE_TRANSFER_THRESHOLD = 25000;
const SPIKE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const SPIKE_MULTIPLIER = 1.5;

const SERVER_COLORS = {
  "Azeroth-1": "#2F9FFF",
  ShadowRealm: "#A65DFF",
  DragonPeak: "#FF4D4D",
  TitanValley: "#5BB75B",
};

const AlertBadge = ({ type, message }) => {
  const isWarning = type === "warning";
  const color = isWarning ? "#FF8C00" : "#FF4D4D";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.6rem 1rem",
        borderRadius: "6px",
        background: `${color}18`,
        border: `1px solid ${color}55`,
        animation: "alert-slide-in 0.3s ease",
      }}
    >
      <AlertTriangle size={15} style={{ color, flexShrink: 0 }} />
      <span
        style={{
          fontSize: "0.82rem",
          fontFamily: "Cinzel, serif",
          fontWeight: "600",
          color,
        }}
      >
        {message}
      </span>
    </div>
  );
};

export const EconomyAlertSystem = () => {
  const { globalEvents } = useGuild();

  const alerts = useMemo(() => {
    const result = [];
    const seen = new Set();

    const addAlert = (key, type, message) => {
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ key, type, message });
      }
    };

    // Check recent events (last 50)
    const recent = globalEvents.slice(0, 50);

    recent.forEach((evt) => {
      // High-value trade alert
      if (
        (evt.type === "PURCHASE" || evt.type === "SALE") &&
        evt.gold >= HIGH_VALUE_TRADE_THRESHOLD
      ) {
        addAlert(
          `high-trade-${evt.server}`,
          "danger",
          `⚠ High Value Trade Detected on ${evt.server} — ${(evt.gold || 0).toLocaleString()}g`
        );
      }

      // High-value transfer alert
      if (
        evt.type === "TRANSFER" &&
        evt.gold >= HIGH_VALUE_TRANSFER_THRESHOLD
      ) {
        addAlert(
          `high-transfer-${evt.player}`,
          "warning",
          `⚠ Large Gold Transfer by ${evt.player} — ${(evt.gold || 0).toLocaleString()}g`
        );
      }
    });

    // Server spike detection: compare last 5 min vs previous 5 min
    const now = Date.now();
    const servers = ["Azeroth-1", "ShadowRealm", "DragonPeak", "TitanValley"];
    servers.forEach((server) => {
      const serverEvents = globalEvents.filter((e) => e.server === server);

      const recentCount = serverEvents.filter(
        (e) =>
          e.timestamp &&
          now - new Date(e.timestamp).getTime() < SPIKE_WINDOW_MS
      ).length;

      const prevCount = serverEvents.filter((e) => {
        if (!e.timestamp) return false;
        const age = now - new Date(e.timestamp).getTime();
        return age >= SPIKE_WINDOW_MS && age < SPIKE_WINDOW_MS * 2;
      }).length;

      if (prevCount > 0 && recentCount > prevCount * SPIKE_MULTIPLIER) {
        addAlert(
          `spike-${server}`,
          "warning",
          `⚠ Gold Surge on ${server} — ${recentCount} events in last 5 min`
        );
      }
    });

    return result;
  }, [globalEvents]);

  if (alerts.length === 0) return null;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <style>{`
        @keyframes alert-slide-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {alerts.map((alert) => (
          <AlertBadge key={alert.key} type={alert.type} message={alert.message} />
        ))}
      </div>
    </div>
  );
};
