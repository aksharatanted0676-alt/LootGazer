import { useGuild } from "../context/GuildContext";
import { InventorySearch } from "../components/InventorySearch";
import { Compass } from "lucide-react";

export const InventoryFinder = () => {
  const { items } = useGuild();

  return (
    <div className="page-container">
      <h2 className="quest-heading">Inventory Finder</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Lore Intro panel */}
        <div className="medieval-panel" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Compass size={18} style={{ color: "var(--gold)" }} />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Search Player Inventories</h3>
          </div>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            Search items and equipment owned by players across the kingdom in real time.
          </p>
        </div>

        {/* Real-time search element */}
        <InventorySearch items={items} />

      </div>
    </div>
  );
};
export default InventoryFinder;
