import { useGuild } from "../context/GuildContext";
import { DashboardCard } from "../components/DashboardCard";
import { GlobalHubSummaryCard } from "../components/GlobalHubSummaryCard";
import { EconomyAlertSystem } from "../components/EconomyAlertSystem";
import { GoldEconomyDashboard } from "../components/GoldEconomyDashboard";
import { Coins, Clock, FileText, Swords, TrendingUp, Sparkles } from "lucide-react";

export const Dashboard = ({ onNavigate }) => {
  const { items, players, trades, auctions } = useGuild();

  // Calculations
  const totalCirculatingGold = players.reduce((sum, p) => sum + p.gold, 0);
  const activeAuctionsCount = auctions.filter(a => a.status === "Active").length;
  
  // Trades count
  const tradesToday = trades.filter(t => t.status === "Completed").length;

  // Most traded artifact (highest tradesCount)
  const mostTraded = items.reduce((prev, current) => {
    return (prev.tradesCount > current.tradesCount) ? prev : current;
  }, items[0] || { name: "None", tradesCount: 0 });

  // Highest value artifact
  const highestValue = items.reduce((prev, current) => {
    return (prev.price > current.price) ? prev : current;
  }, items[0] || { name: "None", price: 0 });

  // Custom mock data for charts matching our adventurers and history
  const goldDistribution = players.map(p => ({
    name: p.name.split(" ")[0], // First name
    gold: p.gold,
    limit: p.bankLimit
  }));

  const priceTrend = [
    { day: "Mon", price: 4100 },
    { day: "Tue", price: 4400 },
    { day: "Wed", price: 4300 },
    { day: "Thu", price: 4800 },
    { day: "Fri", price: 4600 },
    { day: "Sat", price: 5100 },
    { day: "Sun", price: 5400 }
  ];

  const tradeActivity = [
    { time: "9am", count: 2 },
    { time: "11am", count: 5 },
    { time: "1pm", count: 8 },
    { time: "3pm", count: 6 },
    { time: "5pm", count: 12 },
    { time: "7pm", count: 9 },
    { time: "9pm", count: 15 }
  ];

  return (
    <div className="page-container">
      <h2 className="quest-heading">Dashboard</h2>

      {/* Economy Alerts - shows warnings/alerts from live economy */}
      <EconomyAlertSystem />

      {/* Global Trade Hub Summary Card */}
      <GlobalHubSummaryCard onNavigate={onNavigate} />


      {/* Stats Cards Row */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem"
        }}
      >
        <DashboardCard 
          title="Total Gold" 
          value={`${totalCirculatingGold.toLocaleString()} Gold`} 
          subtext="Gold held by all players"
          icon={Coins}
          glow={true}
        />
        <DashboardCard 
          title="Active Auctions" 
          value={activeAuctionsCount} 
          subtext="Items listed for auction"
          icon={Clock}
        />
        <DashboardCard 
          title="Completed Trades" 
          value={tradesToday} 
          subtext="Trades finished so far"
          icon={FileText}
        />
        <DashboardCard 
          title="Most Traded Item" 
          value={mostTraded.name} 
          subtext={`${mostTraded.tradesCount} trades`}
          icon={Swords}
        />
        <DashboardCard 
          title="Highest Value Item" 
          value={highestValue.name} 
          subtext={`Price: ${highestValue.price.toLocaleString()} Gold`}
          icon={TrendingUp}
        />
      </div>

      {/* SVG Charts Row */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}
      >
        {/* Chart 1: Gold Distribution (Bar) */}
        <div className="medieval-panel">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", borderBottom: "1px solid var(--bronze-dark)", paddingBottom: "5px" }}>
            Gold per Player
          </h3>
          <div style={{ position: "relative", width: "100%", height: "240px" }}>
            <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" />
                  <stop offset="100%" stopColor="var(--bronze)" />
                </linearGradient>
              </defs>
              
              {/* Axes */}
              <line x1="40" y1="180" x2="380" y2="180" className="chart-axis" />
              <line x1="40" y1="20" x2="40" y2="180" className="chart-axis" />

              {/* Gridlines */}
              <line x1="40" y1="140" x2="380" y2="140" className="chart-grid-line" />
              <line x1="40" y1="100" x2="380" y2="100" className="chart-grid-line" />
              <line x1="40" y1="60" x2="380" y2="60" className="chart-grid-line" />
              
              {/* Labels */}
              <text x="35" y="183" textAnchor="end" className="chart-text">0</text>
              <text x="35" y="143" textAnchor="end" className="chart-text">10k</text>
              <text x="35" y="103" textAnchor="end" className="chart-text">20k</text>
              <text x="35" y="63" textAnchor="end" className="chart-text">30k</text>

              {/* Bars */}
              {goldDistribution.map((player, idx) => {
                const barWidth = 35;
                const gap = 30;
                const x = 60 + idx * (barWidth + gap);
                // Scale gold values (max gold is 22000, max height is 150)
                const height = (player.gold / 30000) * 150;
                const y = 180 - height;
                const limitHeight = (player.limit / 30000) * 150;
                const limitY = 180 - limitHeight;

                return (
                  <g key={idx}>
                    {/* Bank Limit Line */}
                    <line x1={x - 5} y1={limitY} x2={x + barWidth + 5} y2={limitY} stroke="var(--error-crimson)" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Gold Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill="url(#goldGrad)"
                      stroke="var(--gold)"
                      strokeWidth="1"
                      className="chart-bar"
                    />
                    {/* Name */}
                    <text x={x + barWidth/2} y="198" textAnchor="middle" className="chart-text" style={{ fontSize: "0.7rem" }}>
                      {player.name}
                    </text>
                    {/* Value */}
                    <text x={x + barWidth/2} y={y - 5} textAnchor="middle" className="chart-text" style={{ fontSize: "0.65rem", fill: "var(--gold)" }}>
                      {Math.round(player.gold/100)/10}k
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", display: "block", marginTop: "5px" }}>
            <span style={{ color: "var(--error-crimson)" }}>---</span> Dotted lines show each player's gold limit.
          </span>
        </div>

        {/* Chart 2: Market Index Price Trend (Line) */}
        <div className="medieval-panel">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", borderBottom: "1px solid var(--bronze-dark)", paddingBottom: "5px" }}>
            Item Price Trend (Gold)
          </h3>
          <div style={{ position: "relative", width: "100%", height: "240px" }}>
            <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Axes */}
              <line x1="40" y1="180" x2="380" y2="180" className="chart-axis" />
              <line x1="40" y1="20" x2="40" y2="180" className="chart-axis" />

              {/* Gridlines */}
              <line x1="40" y1="140" x2="380" y2="140" className="chart-grid-line" />
              <line x1="40" y1="100" x2="380" y2="100" className="chart-grid-line" />
              <line x1="40" y1="60" x2="380" y2="60" className="chart-grid-line" />

              {/* Labels */}
              <text x="35" y="183" textAnchor="end" className="chart-text">3k</text>
              <text x="35" y="143" textAnchor="end" className="chart-text">4k</text>
              <text x="35" y="103" textAnchor="end" className="chart-text">5k</text>
              <text x="35" y="63" textAnchor="end" className="chart-text">6k</text>

              {/* Plot points & path */}
              {(() => {
                const points = priceTrend.map((d, idx) => {
                  const x = 60 + idx * 48;
                  // Map price (3000 to 6000) onto height (180 to 20)
                  const height = 180 - ((d.price - 3000) / 3000) * 150;
                  return { x, y: height, label: d.day, val: d.price };
                });

                const dPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
                const dArea = `${dPath} L ${points[points.length-1].x} 180 L ${points[0].x} 180 Z`;

                return (
                  <g>
                    {/* Area fill */}
                    <path d={dArea} className="chart-area" />
                    {/* Line */}
                    <path d={dPath} className="chart-line" />
                    {/* Points & Labels */}
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4" fill="var(--gold)" stroke="var(--bg-dark)" strokeWidth="1" />
                        <text x={p.x} y="198" textAnchor="middle" className="chart-text">{p.label}</text>
                        <text x={p.x} y={p.y - 8} textAnchor="middle" className="chart-text" style={{ fontSize: "0.65rem", fill: "var(--text-light)" }}>
                          {p.val}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Chart 3: Trading Activity (Area) */}
        <div className="medieval-panel">
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", borderBottom: "1px solid var(--bronze-dark)", paddingBottom: "5px" }}>
            Trades Per Hour
          </h3>
          <div style={{ position: "relative", width: "100%", height: "240px" }}>
            <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%" }}>
              {/* Axes */}
              <line x1="40" y1="180" x2="380" y2="180" className="chart-axis" />
              <line x1="40" y1="20" x2="40" y2="180" className="chart-axis" />

              {/* Gridlines */}
              <line x1="40" y1="140" x2="380" y2="140" className="chart-grid-line" />
              <line x1="40" y1="100" x2="380" y2="100" className="chart-grid-line" />
              <line x1="40" y1="60" x2="380" y2="60" className="chart-grid-line" />

              {/* Labels */}
              <text x="35" y="183" textAnchor="end" className="chart-text">0</text>
              <text x="35" y="143" textAnchor="end" className="chart-text">5</text>
              <text x="35" y="103" textAnchor="end" className="chart-text">10</text>
              <text x="35" y="63" textAnchor="end" className="chart-text">15</text>

              {/* Plot */}
              {(() => {
                const points = tradeActivity.map((d, idx) => {
                  const x = 60 + idx * 48;
                  const height = 180 - (d.count / 20) * 150;
                  return { x, y: height, label: d.time, val: d.count };
                });

                const dPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
                const dArea = `${dPath} L ${points[points.length-1].x} 180 L ${points[0].x} 180 Z`;

                return (
                  <g>
                    <path d={dArea} fill="url(#goldGrad)" opacity="0.1" />
                    <path d={dPath} stroke="var(--bronze)" strokeWidth="2" fill="none" />
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="3" fill="var(--bronze)" />
                        <text x={p.x} y="198" textAnchor="middle" className="chart-text" style={{ fontSize: "0.65rem" }}>{p.label}</text>
                        <text x={p.x} y={p.y - 8} textAnchor="middle" className="chart-text" style={{ fontSize: "0.65rem", fill: "var(--gold)" }}>
                          {p.val}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Gold Economy Dashboard (live economy metrics) */}
      <GoldEconomyDashboard />

      {/* Decorative medieval quote / sign */}
      <div 
        className="medieval-panel"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderStyle: "dashed",
          padding: "1rem"
        }}
      >
        <Sparkles size={18} style={{ color: "var(--gold)" }} />
        <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-muted)", textAlign: "center" }}>
          All trades and gold transfers are tracked in real time.
        </p>
      </div>
    </div>
  );
};
export default Dashboard;
