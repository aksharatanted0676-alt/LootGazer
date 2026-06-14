import { AlertTriangle } from "lucide-react";

export const ValidationAlert = ({ message, type = "error" }) => {
  const getColors = () => {
    switch (type) {
      case "error":
        return {
          bg: "rgba(166, 43, 43, 0.1)",
          border: "var(--error-crimson)",
          text: "var(--text-light)",
          accent: "var(--error-crimson)"
        };
      case "warning":
        return {
          bg: "rgba(212, 138, 55, 0.1)",
          border: "var(--warning-amber)",
          text: "var(--text-light)",
          accent: "var(--warning-amber)"
        };
      default:
        return {
          bg: "rgba(139, 107, 63, 0.1)",
          border: "var(--bronze)",
          text: "var(--text-light)",
          accent: "var(--bronze)"
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "4px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: `0 4px 10px rgba(0,0,0,0.5)`,
        animation: "fadeIn 0.3s ease-out"
      }}
    >
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "6px",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: `1px solid ${colors.border}`,
          borderRadius: "4px"
        }}
      >
        <AlertTriangle size={18} style={{ color: colors.accent }} />
      </div>
      <div>
        <div 
          style={{ 
            fontFamily: "Cinzel", 
            fontSize: "0.85rem", 
            color: colors.accent,
            fontWeight: "bold",
            letterSpacing: "0.05em"
          }}
        >
          Validation Warning
        </div>
        <p style={{ margin: 0, fontSize: "0.95rem", color: colors.text, fontStyle: "italic" }}>
          "{message}"
        </p>
      </div>
    </div>
  );
};
export default ValidationAlert;
