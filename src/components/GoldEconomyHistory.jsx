import { useMemo } from "react";
import { useGuild } from "../context/GuildContext";
import { EVENT_COLORS, fmt, formatTimeAgo } from "../utils/economy";
import { History } from "lucide-react";

const TRACKED_TYPES = ["PURCHASE", "SALE", "TRANSFER", "REVERSAL"];

const TypeBadge = ({ type }) => {
  const meta = EVENT_COLORS[type] || { color: "#aaa", label: type };
  return (
    <span
      style={{
        fontSize: "0.68rem",
        fontWeight: "700",
        fontFamily: "Cinzel, serif",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "0.15rem 0.5rem",
        borderRadius: "4px",
        border: `1px solid ${meta.color}55`,
        color: meta.color,
        backgroundColor: `${meta.color}18`,
        whiteSpace: "nowrap",
      }}
    >
      {meta.label}
    </span>
  );
};

export const GoldEconomyHistory = () => {
  const { globalEvents } = useGuild();

  const goldEvents = useMemo(
    () =>
      globalEvents
        .filter((e) => TRACKED_TYPES.includes(e.type))
        .slice(0, 60),
    [globalEvents]
  );

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          borderBottom: "2px solid var(--bronze-dark)",
          paddingBottom: "0.5rem",
        }}
      >
        <History size={20} style={{ color: "var(--gold)" }} />
        <h3
          style={{
            margin: 0,
            fontFamily: "Cinzel, serif",
            fontSize: "1.2rem",
            color: "var(--gold)",
          }}
        >
          Gold Movement History
        </h3>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            fontFamily: "Cinzel, serif",
          }}
        >
          {goldEvents.length} events
        </span>
      </div>

      {/* Events list */}
      <div
        className="glass-card"
        style={{ overflow: "hidden" }}
      >
        <div style={{ maxHeight: "420px", overflowY: "auto" }}>
          {goldEvents.length === 0 && (
            <div
              style={{
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text-muted)",
                fontFamily: "Cinzel, serif",
              }}
            >
              No gold movements recorded yet.
            </div>
          )}

          {goldEvents.map((evt, i) => {
            const meta = EVENT_COLORS[evt.type] || { color: "#aaa" };
            return (
              <div
                key={evt.id || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1.25rem",
                  borderBottom: "1px solid rgba(74,86,100,0.15)",
                  transition: "background 0.2s",
                  gap: "1rem",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${meta.color}08`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Icon dot */}
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: meta.color,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${meta.color}88`,
                  }}
                />

                {/* Player + item */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "var(--text-light)",
                      fontSize: "0.92rem",
                    }}
                  >
                    {evt.player}
                  </span>
                  {evt.item && (
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                        marginLeft: "0.4rem",
                      }}
                    >
                      · {evt.item}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {evt.server}
                  </div>
                </div>

                {/* Type badge */}
                <TypeBadge type={evt.type} />

                {/* Amount */}
                <div
                  style={{
                    fontWeight: "700",
                    color: "var(--gold)",
                    fontSize: "0.9rem",
                    minWidth: "72px",
                    textAlign: "right",
                  }}
                >
                  {fmt(evt.gold || 0)}g
                </div>

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    minWidth: "64px",
                    textAlign: "right",
                  }}
                >
                  {formatTimeAgo(evt.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
