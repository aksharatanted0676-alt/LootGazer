import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import { StatCard } from "./StatCard";
import {
  Coins, TrendingUp, BarChart2, Zap, Send, ShoppingBag
} from "lucide-react";
import {
  fmt,
  calcTotalGoldCirculation,
  calcGoldTradedToday,
  calcAverageTradeValue,
  calcLargestTrade,
  calcTotalGoldTransfers,
  calcMarketplaceVolume,
} from "../utils/economy";

export const GoldEconomyDashboard = () => {
  const { players, trades, globalEvents } = useGuild();

  const totalGoldCirculation = useMemo(
    () => calcTotalGoldCirculation(players),
    [players]
  );
  const goldTradedToday = useMemo(
    () => calcGoldTradedToday(trades),
    [trades]
  );
  const averageTradeValue = useMemo(
    () => calcAverageTradeValue(trades),
    [trades]
  );
  const largestTrade = useMemo(() => calcLargestTrade(trades), [trades]);
  const totalGoldTransfers = useMemo(
    () => calcTotalGoldTransfers(globalEvents),
    [globalEvents]
  );
  const marketplaceVolume = useMemo(
    () => calcMarketplaceVolume(globalEvents),
    [globalEvents]
  );

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      {/* Section Header */}
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
        <Coins size={20} style={{ color: "var(--gold)" }} />
        <h3
          style={{
            margin: 0,
            fontFamily: "Cinzel, serif",
            fontSize: "1.2rem",
            color: "var(--gold)",
          }}
        >
          Gold Economy Monitor
        </h3>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            fontFamily: "Cinzel, serif",
            background: "rgba(60,226,226,0.1)",
            border: "1px solid rgba(60,226,226,0.3)",
            borderRadius: "4px",
            padding: "0.15rem 0.5rem",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Large Circulation Card */}
      <div
        style={{
          marginBottom: "1.25rem",
        }}
      >
        <StatCard
          label="Total Gold Circulation"
          value={`${fmt(totalGoldCirculation)} Gold`}
          subtext="Live sum of all player balances"
          icon={Coins}
          iconColor="var(--gold)"
          large={true}
        />
      </div>

      {/* 5 smaller metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <StatCard
          label="Gold Traded Today"
          value={`${fmt(goldTradedToday)}g`}
          subtext="Completed trades today"
          icon={TrendingUp}
          iconColor="#3CE2E2"
        />
        <StatCard
          label="Average Trade Value"
          value={`${fmt(averageTradeValue)}g`}
          subtext="All-time average"
          icon={BarChart2}
          iconColor="#A65DFF"
        />
        <StatCard
          label="Largest Trade"
          value={`${fmt(largestTrade)}g`}
          subtext="Highest single trade"
          icon={Zap}
          iconColor="#FF8C00"
        />
        <StatCard
          label="Total Transfers"
          value={`${fmt(totalGoldTransfers)}g`}
          subtext="Gold sent between players"
          icon={Send}
          iconColor="#5BB75B"
        />
        <StatCard
          label="Marketplace Volume"
          value={`${fmt(marketplaceVolume)}g`}
          subtext="Total buy + sell volume"
          icon={ShoppingBag}
          iconColor="#D77A38"
        />
      </div>
    </section>
  );
};
