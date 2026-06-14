import { LayoutDashboard, Store, Clock, Scroll, Search, Activity, Lock, Globe, LogIn, LogOut } from "lucide-react";

export const Sidebar = ({ currentPage, setCurrentPage, isOpen, onClose, onLogout }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "marketplace", label: "Marketplace", icon: Store },
    { id: "auctions", label: "Auction Queue", icon: Clock },
    { id: "ledger", label: "Trade Ledger", icon: Scroll },
    { id: "inventory", label: "Inventory", icon: Search },
    { id: "network", label: "Kingdom Feed", icon: Activity },
    { id: "treasury", label: "Gold Transfer", icon: Lock },
    { id: "global-trade-hub", label: "Global Trade Hub", icon: Globe },
    { id: "login", label: "Character Select", icon: LogIn },
    { id: "logout", label: "Leave Tavern", icon: LogOut }
  ];

  const renderContent = () => (
    <>
      <div 
        style={{ 
          textAlign: "center", 
          marginBottom: "1rem", 
          borderBottom: "1px double var(--bronze)",
          paddingBottom: "1.5rem" 
        }}
      >
        <span 
          style={{ 
            fontSize: "0.75rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.15em",
            color: "var(--gold)",
            fontFamily: "Cinzel"
          }}
        >
          Menu
        </span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "logout") {
                  onLogout();
                } else {
                  setCurrentPage(item.id);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "0.8rem 1.2rem",
                backgroundColor: isActive ? "var(--surface-light)" : "transparent",
                color: isActive ? "var(--gold)" : "var(--text-light)",
                border: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "Cinzel, serif",
                fontSize: "0.95rem",
                fontWeight: isActive ? "bold" : "normal",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 10px var(--gold-glow)" : "none",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--gold)";
                  e.currentTarget.style.borderColor = "var(--bronze)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-light)";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              <IconComponent size={18} style={{ color: isActive ? "var(--gold)" : "var(--bronze)" }} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "1rem 0.5rem" }}>
        <div 
          className="medieval-panel"
          style={{ 
            padding: "0.75rem", 
            fontSize: "0.8rem", 
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            marginBottom: 0
          }}
        >
          <p style={{ color: "var(--text-muted)" }}>
            Buy items, trade gold, and manage your inventory.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="desktop-sidebar"
        style={{
          width: "250px",
          backgroundColor: "var(--surface-dark)",
          borderRight: "3px solid var(--bronze)",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          boxShadow: "5px 0 15px rgba(0,0,0,0.4)"
        }}
      >
        {renderContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}
      <aside className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
        {renderContent()}
      </aside>
    </>
  );
};
