import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import {
  calcGoldEarned,
  calcGoldSpent,
  calcGoldTransferred,
  calcGoldReversed,
  fmt,
} from "../utils/economy";
import { TrendingUp } from "lucide-react";

const FlowBar = ({ label, value, maxValue, color, emoji }) => {
  const pct = maxValue > 0 ? Math.min(100, Math.round((value / maxValue) * 100)) : 0;
  return (
    <div
      className="glass-card"
      style={{ padding: "1.25rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.6rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            fontFamily: "Cinzel, serif",
            fontWeight: "700",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {emoji} {label}
        </span>
        <span
          style={{ fontWeight: "700", color, fontSize: "1rem" }}
        >
          {fmt(value)}g
        </span>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          width: "100%",
          height: "6px",
          borderRadius: "4px",
          backgroundColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "4px",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: "width 0.6s ease",
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginTop: "0.35rem",
          textAlign: "right",
        }}
      >
        {pct}% of total volume
      </div>
    </div>
  );
};

export const GoldFlowVisualization = () => {
  const { globalEvents } = useGuild();

  const earned = useMemo(() => calcGoldEarned(globalEvents), [globalEvents]);
  const spent = useMemo(() => calcGoldSpent(globalEvents), [globalEvents]);
  const transferred = useMemo(
    () => calcGoldTransferred(globalEvents),
    [globalEvents]
  );
  const reversed = useMemo(
    () => calcGoldReversed(globalEvents),
    [globalEvents]
  );

  const total = earned + spent + transferred + reversed || 1;

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          borderBottom: "2px solid var(--bronze-dark)",
          paddingBottom: "0.5rem",
        }}
      >
        <TrendingUp size={20} style={{ color: "var(--gold)" }} />
        <h3
          style={{
            margin: 0,
            fontFamily: "Cinzel, serif",
            fontSize: "1.2rem",
            color: "var(--gold)",
          }}
        >
          Gold Flow Visualization
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <FlowBar
          label="Gold Earned"
          value={earned}
          maxValue={total}
          color="#5BB75B"
          emoji="📈"
        />
        <FlowBar
          label="Gold Spent"
          value={spent}
          maxValue={total}
          color="#3CE2E2"
          emoji="🛒"
        />
        <FlowBar
          label="Gold Transferred"
          value={transferred}
          maxValue={total}
          color="#A65DFF"
          emoji="💸"
        />
        <FlowBar
          label="Gold Reversed"
          value={reversed}
          maxValue={total}
          color="#FF4D4D"
          emoji="↩️"
        />
      </div>
    </section>
  );
};
