
export const DashboardCard = ({ title, value, subtext, icon: Icon, glow = false }) => {
  return (
    <div className={`medieval-panel ${glow ? "glowing" : ""}`} style={{ marginBottom: 0, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span 
            style={{ 
              fontSize: "0.85rem", 
              fontFamily: "Cinzel, serif", 
              color: "var(--text-muted)", 
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            {title}
          </span>
          <div 
            style={{ 
              fontSize: "2.1rem", 
              fontWeight: "bold", 
              fontFamily: "MedievalSharp, cursive", 
              color: glow ? "var(--gold)" : "var(--text-light)",
              lineHeight: 1.1,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
            }}
          >
            {value}
          </div>
          {subtext && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              {subtext}
            </span>
          )}
        </div>
        
        {Icon && (
          <div 
            style={{
              padding: "0.6rem",
              borderRadius: "4px",
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "1px solid var(--bronze-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon size={24} style={{ color: glow ? "var(--gold)" : "var(--bronze)" }} />
          </div>
        )}
      </div>
    </div>
  );
};
