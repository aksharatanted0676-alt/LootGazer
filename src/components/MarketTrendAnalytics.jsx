import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import { StatCard } from "./StatCard";
import {
  calcMostTradedItem,
  calcTopTradingServer,
  calcHighestValueTrade,
  calcMostActivePlayer,
  calcMostActiveSeller,
  fmt,
} from "../utils/economy";
import { BarChart2, Server, Zap, User, ShoppingCart } from "lucide-react";

export const MarketTrendAnalytics = () => {
  const { trades, globalEvents } = useGuild();

  const mostTradedItem = useMemo(() => calcMostTradedItem(trades), [trades]);
  const topServer = useMemo(
    () => calcTopTradingServer(globalEvents),
    [globalEvents]
  );
  const highestValueTrade = useMemo(
    () => calcHighestValueTrade(trades),
    [trades]
  );
  const mostActivePlayer = useMemo(
    () => calcMostActivePlayer(globalEvents),
    [globalEvents]
  );
  const mostActiveSeller = useMemo(
    () => calcMostActiveSeller(trades),
    [trades]
  );

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
        <BarChart2 size={20} style={{ color: "var(--gold)" }} />
        <h3
          style={{
            margin: 0,
            fontFamily: "Cinzel, serif",
            fontSize: "1.2rem",
            color: "var(--gold)",
          }}
        >
          Market Trends
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <StatCard
          label="Most Traded Item"
          value={mostTradedItem}
          subtext="By trade count"
          icon={ShoppingCart}
          iconColor="#3CE2E2"
        />
        <StatCard
          label="Top Trading Server"
          value={topServer}
          subtext="By event volume"
          icon={Server}
          iconColor="#A65DFF"
        />
        <StatCard
          label="Highest Value Trade"
          value={`${fmt(highestValueTrade.amount)}g`}
          subtext={highestValueTrade.item || "—"}
          icon={Zap}
          iconColor="#FF8C00"
        />
        <StatCard
          label="Most Active Player"
          value={mostActivePlayer}
          subtext="By event count"
          icon={User}
          iconColor="#5BB75B"
        />
        <StatCard
          label="Most Active Seller"
          value={mostActiveSeller}
          subtext="By sales count"
          icon={BarChart2}
          iconColor="#D77A38"
        />
      </div>
    </section>
  );
};
