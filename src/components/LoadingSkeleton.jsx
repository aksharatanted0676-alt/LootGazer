
export const LoadingSkeleton = () => {
  return (
    <div 
      className="item-card-frame" 
      style={{ 
        height: "320px", 
        borderStyle: "dashed", 
        opacity: 0.4,
        background: "linear-gradient(90deg, #2D2016 25%, #3D2D20 50%, #2D2016 75%)",
        backgroundSize: "200% 100%",
        animation: "pulseShimmer 1.5s infinite linear"
      }}
    >
      <style>{`
        @keyframes pulseShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ flex: 1.5, borderBottom: "1px dashed var(--bronze)" }} />
      <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "16px", backgroundColor: "var(--bronze-dark)", width: "70%", borderRadius: "2px" }} />
        <div style={{ height: "12px", backgroundColor: "var(--bronze-dark)", width: "40%", borderRadius: "2px" }} />
        <div style={{ height: "35px", backgroundColor: "rgba(0,0,0,0.2)", marginTop: "auto", border: "1px dashed var(--bronze)" }} />
      </div>
    </div>
  );
};
export default LoadingSkeleton;
