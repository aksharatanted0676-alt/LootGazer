import { useGuild } from "../context/GuildContext";
import { useTheme } from "../context/ThemeContext";
import { Coins, ShieldAlert, Award, Sun, Moon, Menu, X, LogOut } from "lucide-react";

export const Navbar = ({ onToggleSidebar, isSidebarOpen, onLogout }) => {
  const { players, activePlayerId, setActivePlayerId, activePlayer } = useGuild();
  const { theme, toggleTheme } = useTheme();

  // Calculate total circulating gold in the kingdom
  const totalGoldInCirculation = players.reduce((sum, p) => sum + p.gold, 0);

  return (
    <header 
      style={{
        backgroundColor: "var(--surface-dark)",
        borderBottom: "3px solid var(--bronze)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        padding: "1rem 2rem",
        zIndex: 100,
        position: "sticky",
        top: 0
      }}
    >
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        {/* Left Section: Mobile Menu Trigger + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onToggleSidebar}
            style={{
              background: "none",
              border: "none",
              color: "var(--gold)",
              cursor: "pointer",
              display: "none", // Will be shown via CSS or media block layout
            }}
            className="mobile-menu-trigger"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div 
            style={{
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 15px var(--gold-glow)",
              border: "2px solid var(--text-light)"
            }}
          >
            <span style={{ fontSize: "1.5rem", userSelect: "none" }}>🔱</span>
          </div>
          <div>
            <h1 
              style={{ 
                margin: 0, 
                fontSize: "1.6rem", 
                letterSpacing: "0.08em",
                lineHeight: 1.1
              }}
              className="navbar-logo-text"
            >
              LOOTGAZER
            </h1>
            <span 
              style={{ 
                fontSize: "0.8rem", 
                color: "var(--text-muted)", 
                fontFamily: "Cinzel",
                letterSpacing: "0.1em"
              }}
            >
              Fantasy Item Marketplace
            </span>
          </div>
        </div>

        {/* Center Section: Global Treasury Stat */}
        <div 
          className="navbar-gold-stats"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1.5rem",
            backgroundColor: "rgba(0,0,0,0.25)",
            border: "1px solid var(--bronze-dark)",
            padding: "0.4rem 1rem",
            borderRadius: "4px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "Cinzel", color: "var(--text-muted)" }}>
              Total Gold in Circulation
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--gold)", fontWeight: "bold" }}>
              <Coins size={14} />
              <span>{totalGoldInCirculation.toLocaleString()} Gold</span>
            </div>
          </div>
        </div>

        {/* Right Section: User Session & Mode Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          
          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="btn-fantasy"
            style={{
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              border: "1px solid var(--bronze)",
              width: "40px",
              height: "40px",
              cursor: "pointer"
            }}
            title={theme === "dark" ? "Switch to Day Market (Light)" : "Switch to Night Market (Dark)"}
          >
            {theme === "dark" ? (
              <Sun size={18} style={{ color: "var(--gold)" }} />
            ) : (
              <Moon size={18} style={{ color: "var(--gold)" }} />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn-fantasy btn-danger"
            style={{
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              cursor: "pointer"
            }}
            title="Leave Tavern (Logout)"
          >
            <LogOut size={18} />
          </button>

          {/* Active Player Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label 
              htmlFor="player-selector" 
              style={{ fontSize: "0.75rem", fontFamily: "Cinzel", color: "var(--text-muted)" }}
            >
              Active Player
            </label>
            <select
              id="player-selector"
              className="fantasy-select"
              value={activePlayerId}
              onChange={(e) => setActivePlayerId(e.target.value)}
              style={{ 
                padding: "0.3rem 1.8rem 0.3rem 0.6rem", 
                fontSize: "0.95rem", 
                fontFamily: "Cinzel",
                borderColor: "var(--bronze)",
                cursor: "pointer"
              }}
            >
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.title})
                </option>
              ))}
            </select>
          </div>

          {/* Player Gold Balance and Limit */}
          <div 
            className="active-player-badge"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              backgroundColor: "var(--surface-light)", 
              border: "2px solid var(--gold)", 
              borderRadius: "4px", 
              padding: "0.4rem 1rem",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.2), 0 0 5px var(--gold-glow)"
            }}
          >
            {/* Gold balance */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "Cinzel", color: "var(--gold)" }}>
                Gold Balance
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "1.2rem", color: "var(--gold)" }}>
                <Coins size={18} />
                <span>{activePlayer?.gold.toLocaleString()}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "30px", backgroundColor: "var(--bronze)" }} className="navbar-divider" />

            {/* Bank limit */}
            <div style={{ display: "flex", flexDirection: "column" }} className="navbar-limit">
              <span style={{ fontSize: "0.7rem", fontFamily: "Cinzel", color: "var(--text-muted)" }}>
                Bank Limit
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "1rem" }}>
                <ShieldAlert size={14} />
                <span>{activePlayer?.bankLimit.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Divider */}
            <div style={{ width: "1px", height: "30px", backgroundColor: "var(--bronze)" }} className="navbar-divider" />

            {/* Reputation badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="navbar-reputation">
              <span style={{ fontSize: "0.7rem", fontFamily: "Cinzel", color: "var(--text-muted)" }}>
                Reputation
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "var(--gold)" }}>
                <Award size={14} />
                <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>{activePlayer?.reputation}★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insert styles for the mobile menu button since inline display:none is bypassed on mobile breakpoint */}
      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-trigger {
            display: block !important;
          }
          .navbar-divider, .navbar-limit, .navbar-reputation {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
