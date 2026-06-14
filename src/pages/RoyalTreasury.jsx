import { useState } from "react";
import { useGuild } from "../context/GuildContext";
import { GoldTransferForm } from "../components/GoldTransferForm";
import { ValidationAlert } from "../components/ValidationAlert";
import { Plus, ShieldAlert, FileText } from "lucide-react";

export const RoyalTreasury = () => {
  const { addMarketItem, activePlayer } = useGuild();
  
  // Form States for listing new item
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Weapons");
  const [rarity, setRarity] = useState("Common");
  const [priceStr, setPriceStr] = useState("");
  const [description, setDescription] = useState("");
  const [attack, setAttack] = useState(10);
  const [defense, setDefense] = useState(10);
  const [durability, setDurability] = useState(100);

  const price = parseFloat(priceStr);

  // Real-time validations for Price Safety Guard
  let priceGuardError = "";
  let isListingDisabled = true;

  if (priceStr !== "") {
    if (isNaN(price) || price <= 0) {
      priceGuardError = "Please enter a valid price greater than 0.";
    } else if (price > 100000) {
      priceGuardError = "Price too high. Max is 100,000 gold.";
    } else {
      isListingDisabled = false;
    }
  }

  const handleListArtifact = (e) => {
    e.preventDefault();
    if (isListingDisabled) return;

    addMarketItem({
      name,
      category,
      rarity,
      price: Math.round(price),
      seller: activePlayer.name,
      description: description || "A finely crafted artifact cataloged in the Guild Hall.",
      attack: parseInt(attack) || 0,
      defense: parseInt(defense) || 0,
      durability: parseInt(durability) || 100
    });

    // Reset Form
    setName("");
    setCategory("Weapons");
    setRarity("Common");
    setPriceStr("");
    setDescription("");
    setAttack(10);
    setDefense(10);
    setDurability(100);
  };

  return (
    <div className="page-container">
      <h2 className="quest-heading">Gold Transfer &amp; Item Listing</h2>

      <div className="royal-treasury-layout" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
        
        {/* Left Side: Gold Transfer Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <GoldTransferForm />
          
          <div className="medieval-panel" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
            <h4 style={{ color: "var(--gold)", fontSize: "1.1rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
              <ShieldAlert size={14} />
              <span>Gold Limit Rule</span>
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
              No player can hold more gold than their bank limit allows. Any transfer that would push a player over their limit is automatically blocked.
            </p>
          </div>
        </div>

        {/* Right Side: Price Safety Guard Item Listing Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <form onSubmit={handleListArtifact} className="medieval-panel" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ borderBottom: "1px double var(--bronze)", paddingBottom: "8px", marginBottom: "5px" }}>
              <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={18} style={{ color: "var(--gold)" }} />
                <span>List a New Item</span>
              </h3>
            </div>

            {/* Artifact Name */}
            <div className="fantasy-form-group">
              <label htmlFor="artifact-name">Item Name</label>
              <input
                id="artifact-name"
                type="text"
                className="fantasy-input"
                placeholder="E.g., Shield of Valor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Category & Rarity Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="fantasy-form-group">
                <label htmlFor="artifact-cat">Category</label>
                <select
                  id="artifact-cat"
                  className="fantasy-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Weapons">Weapons</option>
                  <option value="Shields">Shields</option>
                  <option value="Armor">Armor</option>
                  <option value="Relics">Relics</option>
                  <option value="Potions">Potions</option>
                </select>
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="artifact-rarity">Rarity</label>
                <select
                  id="artifact-rarity"
                  className="fantasy-select"
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
            </div>

            {/* Valuation Price Input */}
            <div className="fantasy-form-group">
              <label htmlFor="artifact-price">Price (Gold)</label>
              <input
                id="artifact-price"
                type="number"
                className="fantasy-input"
                placeholder="E.g., 1200"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="fantasy-form-group">
              <label htmlFor="artifact-desc">Description (optional)</label>
              <textarea
                id="artifact-desc"
                className="fantasy-textarea"
                placeholder="Describe the item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
              />
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div className="fantasy-form-group">
                <label htmlFor="artifact-atk" style={{ fontSize: "0.8rem" }}>Attack</label>
                <input
                  id="artifact-atk"
                  type="number"
                  className="fantasy-input"
                  value={attack}
                  onChange={(e) => setAttack(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="artifact-def" style={{ fontSize: "0.8rem" }}>Defense</label>
                <input
                  id="artifact-def"
                  type="number"
                  className="fantasy-input"
                  value={defense}
                  onChange={(e) => setDefense(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="artifact-dur" style={{ fontSize: "0.8rem" }}>Durability</label>
                <input
                  id="artifact-dur"
                  type="number"
                  className="fantasy-input"
                  value={durability}
                  onChange={(e) => setDurability(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Validation Alert */}
            {priceGuardError && (
              <ValidationAlert message={priceGuardError} type="error" />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isListingDisabled || !name.trim()}
              className="btn-fantasy btn-success"
              style={{
                alignSelf: "flex-end",
                marginTop: "10px",
                padding: "0.6rem 1.5rem"
              }}
            >
              <FileText size={14} />
              <span>List Item</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
export default RoyalTreasury;
