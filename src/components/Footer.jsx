
export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface-dark)",
        borderTop: "3px solid var(--bronze)",
        padding: "1.5rem",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "var(--text-muted)",
        marginTop: "auto"
      }}
    >
      <div 
        style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          gap: "8px" 
        }}
      >
        <div style={{ fontSize: "1.2rem", letterSpacing: "0.1em" }}>🛡️ ⚔️ ⚜️</div>
        <p style={{ fontFamily: "Cinzel", letterSpacing: "0.05em" }}>
          LootGazer — A virtual item marketplace.
        </p>
        <p style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
          All trades, auctions, and transfers are tracked automatically.
        </p>
      </div>
    </footer>
  );
};
