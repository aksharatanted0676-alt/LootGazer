// ─── Economy Utility Functions ──────────────────────────────────────────────

export const fmt = (num) => (num || 0).toLocaleString();

export const calcTotalGoldCirculation = (players) =>
  players.reduce((sum, p) => sum + (p.gold || 0), 0);

export const calcGoldTradedToday = (trades) => {
  const today = new Date().toDateString();
  return trades
    .filter((t) => new Date(t.timestamp).toDateString() === today)
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

export const calcAverageTradeValue = (trades) => {
  if (!trades.length) return 0;
  const total = trades.reduce((s, t) => s + (t.amount || 0), 0);
  return Math.round(total / trades.length);
};

export const calcLargestTrade = (trades) => {
  if (!trades.length) return 0;
  return Math.max(...trades.map((t) => t.amount || 0));
};

export const calcTotalGoldTransfers = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "TRANSFER")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcMarketplaceVolume = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "PURCHASE" || e.type === "SALE")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcGoldEarned = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "SALE")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcGoldSpent = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "PURCHASE")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcGoldTransferred = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "TRANSFER")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcGoldReversed = (globalEvents) =>
  globalEvents
    .filter((e) => e.type === "REVERSAL")
    .reduce((s, e) => s + (e.gold || 0), 0);

export const calcMostTradedItem = (trades) => {
  if (!trades.length) return "—";
  const counts = {};
  trades.forEach((t) => {
    counts[t.item] = (counts[t.item] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
};

export const calcTopTradingServer = (globalEvents) => {
  const servers = {};
  globalEvents
    .filter((e) => e.type === "PURCHASE" || e.type === "SALE")
    .forEach((e) => {
      servers[e.server] = (servers[e.server] || 0) + 1;
    });
  return Object.entries(servers).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
};

export const calcHighestValueTrade = (trades) => {
  if (!trades.length) return { item: "—", amount: 0 };
  return trades.reduce((prev, t) =>
    (t.amount || 0) > (prev.amount || 0) ? t : prev
  );
};

export const calcMostActivePlayer = (globalEvents) => {
  const players = {};
  globalEvents.forEach((e) => {
    if (e.player) players[e.player] = (players[e.player] || 0) + 1;
  });
  return Object.entries(players).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
};

export const calcMostActiveSeller = (trades) => {
  const sellers = {};
  trades.forEach((t) => {
    if (t.seller) sellers[t.seller] = (sellers[t.seller] || 0) + 1;
  });
  return Object.entries(sellers).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
};

export const formatTimeAgo = (date) => {
  if (!date) return "";
  const d =
    typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 10) return "Just Now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const EVENT_COLORS = {
  PURCHASE: { color: "#3CE2E2", label: "Purchase" },
  SALE: { color: "#D77A38", label: "Sale" },
  TRANSFER: { color: "#5BB75B", label: "Transfer" },
  REVERSAL: { color: "#FF4D4D", label: "Reversal" },
  AUCTION_CREATED: { color: "#A65DFF", label: "Auction" },
};
