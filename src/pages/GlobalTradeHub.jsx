import { useMemo, useState, useEffect } from "react";
import { useGuild } from "../context/GuildContext";
import { EconomyAlertSystem } from "../components/EconomyAlertSystem";
import { GoldEconomyDashboard } from "../components/GoldEconomyDashboard";
import { GoldEconomyHistory } from "../components/GoldEconomyHistory";
import { LiveEconomyStatus } from "../components/LiveEconomyStatus";
import { 
  Globe, 
  ShoppingCart, 
  DollarSign, 
  Send, 
  Undo2, 
  Gavel, 
  TrendingUp, 
  Server, 
  Search,
  Activity,
  Layers
} from "lucide-react";

const SERVERS = ["Azeroth-1", "ShadowRealm", "DragonPeak", "TitanValley"];

export const GlobalTradeHub = () => {
  const { globalEvents } = useGuild();
  const [filterServer, setFilterServer] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerTime, setTickerTime] = useState(() => Date.now());

  // Update timestamps reactively every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerTime(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format timestamp to relative human-readable format
  const formatTimeAgo = (date) => {
    if (!date) return "";
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    const seconds = Math.floor((tickerTime - d.getTime()) / 1000);
    
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // 1. Ticker events (recent 10 events)
  const tickerEvents = useMemo(() => {
    return globalEvents.slice(0, 10);
  }, [globalEvents]);

  // Format ticker action texts
  const formatTickerEvent = (event) => {
    const sBadge = `[${event.server}]`;
    switch (event.type) {
      case "PURCHASE":
        return `${sBadge} ${event.player} bought ${event.item} for ${event.gold} gold`;
      case "SALE":
        return `${sBadge} ${event.player} sold ${event.item} for ${event.gold} gold`;
      case "TRANSFER":
        return `${sBadge} ${event.player} sent ${event.gold} gold`;
      case "REVERSAL":
        return `${sBadge} ${event.player} cancelled trade of ${event.item}`;
      case "AUCTION_CREATED":
        return `${sBadge} ${event.player} put ${event.item} up for auction at ${event.gold} gold`;
      default:
        return `${sBadge} ${event.player} did something`;
    }
  };

  // 2. Global Statistics
  const globalStats = useMemo(() => {
    let totalTrades = 0;
    let totalGoldTraded = 0;
    let totalAuctionsCreated = 0;
    let totalTransfers = 0;
    let totalReversals = 0;

    globalEvents.forEach(event => {
      if (event.type === "PURCHASE") {
        totalTrades++;
        totalGoldTraded += event.gold || 0;
      } else if (event.type === "AUCTION_CREATED") {
        totalAuctionsCreated++;
      } else if (event.type === "TRANSFER") {
        totalTransfers++;
        totalGoldTraded += event.gold || 0;
      } else if (event.type === "REVERSAL") {
        totalReversals++;
      }
    });

    return {
      totalTrades,
      totalGoldTraded,
      totalAuctionsCreated,
      totalTransfers,
      totalReversals
    };
  }, [globalEvents]);

  // 3. Per-Server Statistics
  const serverStats = useMemo(() => {
    return SERVERS.reduce((acc, server) => {
      let eventsCount = 0;
      let tradesCount = 0;
      let goldVolume = 0;

      globalEvents.forEach(event => {
        if (event.server === server) {
          eventsCount++;
          if (event.type === "PURCHASE" || event.type === "SALE") {
            tradesCount++;
          }
          if (event.type === "PURCHASE" || event.type === "SALE" || event.type === "TRANSFER") {
            goldVolume += event.gold || 0;
          }
        }
      });

      // Split tradesCount by 2 since a trade is recorded as both PURCHASE and SALE
      // However, if the buyer and seller are on different servers, each server correctly gets 1 trade (either buy or sell)
      // To represent trades accurately per server, we'll keep the direct event-matching counts.

      acc[server] = {
        eventsCount,
        tradesCount,
        goldVolume
      };
      return acc;
    }, {});
  }, [globalEvents]);

  // 4. Filtered Events for Feed
  const filteredEvents = useMemo(() => {
    return globalEvents.filter(event => {
      const serverMatch = filterServer === "ALL" || event.server === filterServer;
      const typeMatch = filterType === "ALL" || event.type === filterType;
      
      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || 
        event.player.toLowerCase().includes(query) ||
        event.item.toLowerCase().includes(query) ||
        event.server.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query);

      return serverMatch && typeMatch && searchMatch;
    });
  }, [globalEvents, filterServer, filterType, searchQuery]);

  // Helper styles/classes
  const getServerBadgeStyles = (server) => {
    switch (server) {
      case "Azeroth-1":
        return { backgroundColor: "rgba(47, 159, 255, 0.12)", color: "#2F9FFF", borderColor: "rgba(47, 159, 255, 0.4)" };
      case "ShadowRealm":
        return { backgroundColor: "rgba(166, 93, 255, 0.12)", color: "#A65DFF", borderColor: "rgba(166, 93, 255, 0.4)" };
      case "DragonPeak":
        return { backgroundColor: "rgba(255, 77, 77, 0.12)", color: "#FF4D4D", borderColor: "rgba(255, 77, 77, 0.4)" };
      case "TitanValley":
        return { backgroundColor: "rgba(91, 183, 91, 0.12)", color: "#5BB75B", borderColor: "rgba(91, 183, 91, 0.4)" };
      default:
        return { backgroundColor: "var(--surface-light)", color: "var(--text-light)", borderColor: "var(--bronze)" };
    }
  };

  const getEventDetails = (event) => {
    switch (event.type) {
      case "PURCHASE":
        return {
          icon: <ShoppingCart size={16} />,
          iconBg: "rgba(60, 226, 226, 0.15)",
          iconColor: "var(--cyan)",
          actionText: "purchased",
          detailText: event.item
        };
      case "SALE":
        return {
          icon: <DollarSign size={16} />,
          iconBg: "rgba(215, 122, 56, 0.15)",
          iconColor: "var(--gold)",
          actionText: "sold",
          detailText: event.item
        };
      case "TRANSFER":
        return {
          icon: <Send size={16} />,
          iconBg: "rgba(91, 183, 91, 0.15)",
          iconColor: "#5BB75B",
          actionText: "sent gold",
          detailText: event.item
        };
      case "REVERSAL":
        return {
          icon: <Undo2 size={16} />,
          iconBg: "rgba(255, 77, 77, 0.15)",
          iconColor: "#FF4D4D",
          actionText: "cancelled trade",
          detailText: `Returned: ${event.item}`
        };
      case "AUCTION_CREATED":
        return {
          icon: <Gavel size={16} />,
          iconBg: "rgba(166, 93, 255, 0.15)",
          iconColor: "#A65DFF",
          actionText: "started an auction",
          detailText: event.item
        };
      default:
        return {
          icon: <Activity size={16} />,
          iconBg: "var(--surface-light)",
          iconColor: "var(--text-light)",
          actionText: "performed action",
          detailText: event.item
        };
    }
  };

  return (
    <div className="page-container">
      {/* Custom styles for Ticker Marquee, glassmorphism, and layouts */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-wrap {
          width: 100%;
          overflow: hidden;
          background: rgba(18, 22, 26, 0.7);
          backdrop-filter: blur(10px);
          border: 1.5px solid var(--bronze-dark);
          border-radius: 6px;
          padding: 0.65rem 1rem;
          margin-bottom: 2rem;
          position: relative;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.3);
        }

        .ticker-container {
          display: flex;
          width: max-content;
        }

        .ticker-content {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
          padding-right: 2rem;
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          color: var(--text-light);
          font-size: 0.95rem;
          font-family: 'Cinzel', serif;
        }

        .ticker-divider {
          color: var(--gold);
          margin: 0 1.5rem;
          font-weight: bold;
          text-shadow: 0 0 5px var(--gold-glow);
        }

        .glass-card {
          background: rgba(28, 34, 41, 0.6);
          backdrop-filter: blur(12px);
          border: 1.5px solid var(--bronze-dark);
          border-radius: 6px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          border-color: var(--gold);
          box-shadow: 0 12px 40px rgba(215, 122, 56, 0.15), inset 0 0 15px rgba(215, 122, 56, 0.05);
          transform: translateY(-2px);
        }

        .server-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .feed-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 900px) {
          .feed-container {
            grid-template-columns: 280px 1fr;
          }
        }

        .server-badge {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .event-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid rgba(74, 86, 100, 0.15);
          transition: background-color 0.2s ease;
        }

        .event-card:hover {
          background-color: rgba(60, 226, 226, 0.02);
        }

        .event-card:last-child {
          border-bottom: none;
        }

        .empty-feed {
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          font-family: 'Cinzel', serif;
        }
      `}</style>

      <h2 className="quest-heading">Global Trade Hub</h2>
      <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "-1.25rem", marginBottom: "1.5rem", fontSize: "1rem" }}>Live trades, auctions, and gold transfers from all game servers.</p>

      {/* Economy Alerts */}
      <EconomyAlertSystem />


      {/* 1. Recent Activity Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-container">
          <div className="ticker-content">
            {tickerEvents.map((evt, i) => (
              <span key={`t1-${evt.id}-${i}`} className="ticker-item">
                {formatTickerEvent(evt)}
                <span className="ticker-divider">•</span>
              </span>
            ))}
            {/* Duplicate list to create seamless infinite scrolling */}
            {tickerEvents.map((evt, i) => (
              <span key={`t2-${evt.id}-${i}`} className="ticker-item">
                {formatTickerEvent(evt)}
                <span className="ticker-divider">•</span>
              </span>
            ))}
            {tickerEvents.length === 0 && (
              <span className="ticker-item" style={{ color: "var(--text-muted)" }}>
                No activity yet. Buy items, start auctions, or send gold to see live updates here.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dynamic Global Statistics Panel */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem"
        }}
      >
        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ color: "var(--cyan)", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
            <Globe size={24} />
          </div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontFamily: "Cinzel", fontWeight: "bold" }}>
            Total Trades
          </span>
          <h4 style={{ fontSize: "1.8rem", margin: "0.25rem 0 0", fontFamily: "MedievalSharp", color: "var(--text-light)" }}>
            {globalStats.totalTrades}
          </h4>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ color: "var(--gold)", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
            <TrendingUp size={24} />
          </div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontFamily: "Cinzel", fontWeight: "bold" }}>
            Gold Moved
          </span>
          <h4 style={{ fontSize: "1.8rem", margin: "0.25rem 0 0", fontFamily: "MedievalSharp", color: "var(--gold)" }}>
            {globalStats.totalGoldTraded.toLocaleString()}g
          </h4>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ color: "#A65DFF", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
            <Gavel size={24} />
          </div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontFamily: "Cinzel", fontWeight: "bold" }}>
            Auctions Started
          </span>
          <h4 style={{ fontSize: "1.8rem", margin: "0.25rem 0 0", fontFamily: "MedievalSharp", color: "var(--text-light)" }}>
            {globalStats.totalAuctionsCreated}
          </h4>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ color: "#5BB75B", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
            <Send size={24} />
          </div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontFamily: "Cinzel", fontWeight: "bold" }}>
            Transfers
          </span>
          <h4 style={{ fontSize: "1.8rem", margin: "0.25rem 0 0", fontFamily: "MedievalSharp", color: "var(--text-light)" }}>
            {globalStats.totalTransfers}
          </h4>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ color: "#FF4D4D", display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
            <Undo2 size={24} />
          </div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontFamily: "Cinzel", fontWeight: "bold" }}>
            Reversals
          </span>
          <h4 style={{ fontSize: "1.8rem", margin: "0.25rem 0 0", fontFamily: "MedievalSharp", color: "var(--text-light)" }}>
            {globalStats.totalReversals}
          </h4>
        </div>
      </div>

      {/* 3. Server Activity Dashboard */}
      <h3 style={{ fontSize: "1.25rem", borderBottom: "2px solid var(--bronze-dark)", paddingBottom: "0.5rem", marginBottom: "1.25rem", fontFamily: "Cinzel" }}>
        Activity by Server
      </h3>
      <div className="server-grid">
        {SERVERS.map(server => {
          const stats = serverStats[server] || { eventsCount: 0, tradesCount: 0, goldVolume: 0 };
          const badgeStyles = getServerBadgeStyles(server);
          return (
            <div key={server} className="glass-card" style={{ padding: "1.5rem", position: "relative" }}>
              {/* Server Title Badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span className="server-badge" style={badgeStyles}>{server}</span>
                <Server size={18} style={{ color: badgeStyles.color, opacity: 0.7 }} />
              </div>

              {/* Stats Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Events:</span>
                  <span style={{ fontWeight: "bold", color: "var(--text-light)" }}>{stats.eventsCount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Trades:</span>
                  <span style={{ fontWeight: "bold", color: "var(--text-light)" }}>{stats.tradesCount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Gold Moved:</span>
                  <span style={{ fontWeight: "bold", color: "var(--gold)" }}>{stats.goldVolume.toLocaleString()}g</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Global Live Feed & Filters */}
      <div className="feed-container">
        {/* Filters Panel + Live Economy Status (Left Sidebar on desktop) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Live Economy Status widget */}
          <LiveEconomyStatus />

          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ fontFamily: "Cinzel", fontSize: "1.05rem", color: "var(--gold)", marginBottom: "1rem", borderBottom: "1px solid var(--bronze-dark)", paddingBottom: "0.3rem" }}>
              Filter
            </h4>

            {/* Search Input */}
            <div className="fantasy-form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Search size={14} /> Search
              </label>

              <input 
                type="text" 
                className="fantasy-input" 
                placeholder="Search by name, item, or server..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", fontSize: "0.95rem" }}
              />
            </div>

            {/* Server Selector */}
            <div className="fantasy-form-group" style={{ marginBottom: "1.25rem" }}>
              <label>Server</label>
              <select 
                className="fantasy-select"
                value={filterServer}
                onChange={(e) => setFilterServer(e.target.value)}
                style={{ width: "100%", fontSize: "0.95rem" }}
              >
                <option value="ALL">All Servers</option>
                {SERVERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Event Type Selector */}
            <div className="fantasy-form-group">
              <label>Action Type</label>
              <select 
                className="fantasy-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ width: "100%", fontSize: "0.95rem" }}
              >
                <option value="ALL">All</option>
                <option value="PURCHASE">Buy</option>
                <option value="SALE">Sell</option>
                <option value="TRANSFER">Send Gold</option>
                <option value="REVERSAL">Cancel Trade</option>
                <option value="AUCTION_CREATED">Auction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Feed Listings (Right side on desktop) */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <div 
            style={{ 
              padding: "1.25rem 1.5rem", 
              borderBottom: "1px solid var(--bronze-dark)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            }}
          >
            <h3 style={{ fontSize: "1.15rem", margin: 0, fontFamily: "Cinzel", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} className="text-cyan" /> Live Feed
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Cinzel" }}>
              {filteredEvents.length} results
            </span>
          </div>

          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {filteredEvents.map((event) => {
              const details = getEventDetails(event);
              const serverBadgeStyles = getServerBadgeStyles(event.server);

              return (
                <div key={event.id} className="event-card">
                  {/* Left Column: Icon + Description */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                    {/* Event Type Icon Wrap */}
                    <div 
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        backgroundColor: details.iconBg,
                        color: details.iconColor,
                        border: `1px solid ${details.iconColor}`,
                        flexShrink: 0
                      }}
                    >
                      {details.icon}
                    </div>

                    {/* Action Text */}
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontWeight: "600", color: "var(--text-light)" }}>
                        {event.player}
                      </span>{" "}
                      <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        {details.actionText}
                      </span>{" "}
                      <span style={{ fontWeight: "500", color: "var(--cyan)", textDecoration: event.type === "REVERSAL" ? "line-through" : "none" }}>
                        {details.detailText}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Server, Gold, and Timestamp */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                    {/* Server badge */}
                    <span className="server-badge" style={{ ...serverBadgeStyles, fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                      {event.server}
                    </span>

                    {/* Gold Amount */}
                    {event.gold !== undefined && event.gold > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "var(--gold)", fontWeight: "bold", width: "80px", justifyContent: "flex-end" }}>
                        <CoinsIcon size={12} />
                        <span>{event.gold}g</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", width: "80px", textAlign: "right" }}>
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="empty-feed">
                <Layers size={32} style={{ color: "var(--text-muted)", marginBottom: "0.75rem", opacity: 0.5 }} />
                <p style={{ fontSize: "0.95rem" }}>Nothing to show. Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Gold Economy Dashboard */}
      <GoldEconomyDashboard />

      {/* 6. Gold Movement History */}
      <GoldEconomyHistory />
    </div>
  );
};

// Mini internal helper components to avoid imports
const CoinsIcon = ({ size = 14 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="6" />
    <circle cx="18" cy="18" r="4" />
    <path d="M12 18a6 6 0 0 0-3.5-5.5" />
  </svg>
);
