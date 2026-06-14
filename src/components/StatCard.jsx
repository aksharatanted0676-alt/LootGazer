// Reusable StatCard component used across all economy dashboards

export const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "var(--gold)",
  glowColor,
  large = false,
}) => {
  const glow = glowColor || iconColor;
  return (
    <div
      className="glass-card"
      style={{
        padding: large ? "1.75rem" : "1.25rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 16px 48px ${glow}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Glow accent top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
        }}
      />

      {Icon && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.6rem",
            color: iconColor,
            filter: `drop-shadow(0 0 6px ${iconColor}99)`,
          }}
        >
          <Icon size={large ? 28 : 22} />
        </div>
      )}

      <p
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          fontFamily: "Cinzel, serif",
          fontWeight: "700",
          margin: "0 0 0.35rem",
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontSize: large ? "2rem" : "1.5rem",
          fontWeight: "800",
          color: iconColor === "var(--gold)" ? "var(--gold)" : "var(--text-light)",
          margin: "0 0 0.25rem",
          fontFamily: "MedievalSharp, serif",
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>

      {subtext && (
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
