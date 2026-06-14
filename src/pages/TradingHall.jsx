import { useState, useEffect } from "react";
import { useGuild } from "../context/GuildContext";
import { ItemCard } from "../components/ItemCard";
import { ItemDetailsModal } from "../components/ItemDetailsModal";
import { Pagination } from "../components/Pagination";
import { Search, PackageX } from "lucide-react";

export const TradingHall = () => {
  const { items, buyItem, activePlayer } = useGuild();
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [openWithAuction, setOpenWithAuction] = useState(false);

  // Hash-based history management to prevent unexpected redirection to dashboard on browser back button
  useEffect(() => {
    if (selectedItem) {
      if (window.location.hash !== "#inspect") {
        window.history.pushState({ modalOpen: true }, "", `${window.location.pathname}#inspect`);
      }
    } else {
      if (window.location.hash === "#inspect") {
        window.history.back();
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== "#inspect" && selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedItem]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("PriceAsc"); // PriceAsc, PriceDesc, RarityDesc, ActivityDesc

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sorting weight mapping for Rarity
  const rarityWeights = {
    "Legendary": 5,
    "Epic": 4,
    "Rare": 3,
    "Uncommon": 2,
    "Common": 1
  };

  // Filter items
  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === "All" || item.rarity === selectedRarity;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesRarity && matchesCategory;
  });

  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "PriceAsc":
        return a.price - b.price;
      case "PriceDesc":
        return b.price - a.price;
      case "RarityDesc":
        return (rarityWeights[b.rarity] || 0) - (rarityWeights[a.rarity] || 0);
      case "ActivityDesc":
        return b.tradesCount - a.tradesCount;
      default:
        return 0;
    }
  });

  // Paginate items
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filter changes
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="page-container">
      <h2 className="quest-heading">Marketplace</h2>

      {/* Filter Control Board */}
      <div 
        className="medieval-panel"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.2rem",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.35)",
          marginBottom: "2rem"
        }}
      >
        {/* Search Input */}
        <div style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.85rem", fontFamily: "Cinzel", color: "var(--gold)" }}>
            Search Items
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="fantasy-input"
              placeholder="Search by item name..."
              value={searchTerm}
              onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
              style={{ width: "100%", paddingLeft: "2rem" }}
            />
            <Search 
              size={14} 
              style={{ 
                position: "absolute", 
                left: "10px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--bronze)" 
              }} 
            />
          </div>
        </div>

        {/* Filter Rarity */}
        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.85rem", fontFamily: "Cinzel", color: "var(--gold)" }}>
            Rarity
          </label>
          <select
            className="fantasy-select"
            value={selectedRarity}
            onChange={(e) => handleFilterChange(setSelectedRarity, e.target.value)}
          >
            <option value="All">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </div>

        {/* Filter Category */}
        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.85rem", fontFamily: "Cinzel", color: "var(--gold)" }}>
            Category
          </label>
          <select
            className="fantasy-select"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Weapons">Weapons</option>
            <option value="Shields">Shields</option>
            <option value="Armor">Armor</option>
            <option value="Relics">Relics</option>
            <option value="Potions">Potions</option>
          </select>
        </div>

        {/* Sorting options */}
        <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.85rem", fontFamily: "Cinzel", color: "var(--gold)" }}>
            Sort By
          </label>
          <select
            className="fantasy-select"
            value={sortBy}
            onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
          >
            <option value="PriceAsc">Price: Low to High</option>
            <option value="PriceDesc">Price: High to Low</option>
            <option value="RarityDesc">Rarity: High to Low</option>
            <option value="ActivityDesc">Popularity (Most Traded)</option>
          </select>
        </div>
      </div>

      {/* Grid of items */}
      {paginatedItems.length === 0 ? (
        <div 
          className="medieval-panel"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <PackageX size={48} style={{ color: "var(--bronze)" }} />
          <h3 style={{ margin: 0, fontSize: "1.4rem" }}>No items found</h3>
          <p style={{ margin: 0, maxWidth: "500px" }}>
            No items match your search. Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div>
          <div className="trading-hall-grid">
            {paginatedItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={(item) => {
                  setOpenWithAuction(false);
                  setSelectedItem(item);
                }}
                onBuy={(id) => buyItem(id, activePlayer.id)}
                onAuction={(item) => {
                  setOpenWithAuction(true);
                  setSelectedItem(item);
                }}
                activePlayerName={activePlayer.name}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal Inspector Details scroll */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          initialShowAuction={openWithAuction}
          onClose={() => setSelectedItem(null)}
          onBuy={(id) => buyItem(id, activePlayer.id)}
          activePlayer={activePlayer}
        />
      )}
    </div>
  );
};
export default TradingHall;
