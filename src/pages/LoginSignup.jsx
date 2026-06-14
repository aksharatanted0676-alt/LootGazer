import { useState } from "react";
import { useGuild } from "../context/GuildContext";
import { UserPlus, LogIn, Swords, ShieldCheck } from "lucide-react";

export const LoginSignup = ({ onLoginSuccess }) => {
  const { players, activePlayerId, setActivePlayerId, registerPlayer, removePlayer } = useGuild();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [charName, setCharName] = useState("");
  const [charTitle, setCharTitle] = useState("Novice Adventurer");
  const [selectedServer, setSelectedServer] = useState("Azeroth-1");
  const [startingGold, setStartingGold] = useState("1000");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = (playerId) => {
    setActivePlayerId(playerId);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!charName.trim()) {
      setErrorMsg("Please enter a character name.");
      return;
    }

    const nameExists = players.some(
      (p) => p.name.toLowerCase() === charName.trim().toLowerCase()
    );
    if (nameExists) {
      setErrorMsg("Character name already registered in the guild registry!");
      return;
    }

    const gold = parseInt(startingGold);
    if (isNaN(gold) || gold < 100 || gold > 50000) {
      setErrorMsg("Starting Gold must be a number between 100 and 50,000.");
      return;
    }

    const newPlayerId = "player-" + (players.length + 1);
    const newPlayer = {
      id: newPlayerId,
      name: charName.trim(),
      title: charTitle,
      gold: gold,
      bankLimit: gold * 3,
      reputation: 5.0,
      server: selectedServer,
    };

    registerPlayer(newPlayer);
    setActivePlayerId(newPlayerId);
    
    // Reset fields
    setCharName("");
    setIsSignUpMode(false);
    
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <style>{`
        .auth-container {
          max-width: 480px;
          width: 100%;
          animation: parchmentOpen 0.5s ease-out;
        }
        .tab-button {
          flex: 1;
          padding: 1rem;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          background: rgba(18, 22, 26, 0.5);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 2px solid var(--bronze-dark);
        }
        .tab-button.active {
          color: var(--gold);
          background: rgba(28, 34, 41, 0.85);
          border-bottom: 2px solid var(--gold);
          text-shadow: 0 0 8px var(--gold-glow);
        }
        .player-select-btn {
          width: 100%;
          padding: 0.85rem 1rem;
          margin-bottom: 0.75rem;
          background: rgba(10, 12, 16, 0.4);
          border: 1.5px solid var(--bronze-dark);
          border-radius: 4px;
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .player-select-btn:hover {
          border-color: var(--cyan);
          box-shadow: 0 0 10px var(--cyan-glow);
          background: rgba(60, 226, 226, 0.05);
        }
        .player-select-btn.active {
          border-color: var(--gold);
          box-shadow: 0 0 10px var(--gold-glow);
          background: rgba(215, 122, 56, 0.08);
        }
      `}</style>

      <div className="medieval-panel glowing auth-container" style={{ padding: 0, overflow: "hidden" }}>
        {/* Auth Tabs */}
        <div style={{ display: "flex", width: "100%" }}>
          <button 
            className={`tab-button ${!isSignUpMode ? "active" : ""}`} 
            onClick={() => { setIsSignUpMode(false); setErrorMsg(""); }}
          >
            <LogIn size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Enter Tavern (Sign In)
          </button>
          <button 
            className={`tab-button ${isSignUpMode ? "active" : ""}`} 
            onClick={() => { setIsSignUpMode(true); setErrorMsg(""); }}
          >
            <UserPlus size={16} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            New Character (Sign Up)
          </button>
        </div>

        <div style={{ padding: "2rem" }}>
          {!isSignUpMode ? (
            <div>
              <h3 style={{ fontFamily: "Cinzel", textAlign: "center", marginBottom: "1.5rem", color: "var(--gold)" }}>
                Identify Yourself, Adventurer
              </h3>
              
              <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                {players.map((player) => {
                  const isActive = player.id === activePlayerId;
                  return (
                    <div
                      key={player.id}
                      className={`player-select-btn ${isActive ? "active" : ""}`}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div 
                        onClick={() => handleSignIn(player.id)}
                        style={{ flex: 1, cursor: "pointer", paddingRight: "10px" }}
                      >
                        <strong style={{ display: "block", color: isActive ? "var(--gold)" : "var(--text-light)" }}>
                          {player.name}
                        </strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {player.title} • {player.server}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <span style={{ color: "var(--gold)", fontWeight: "bold", fontSize: "0.95rem" }}>
                          💰 {player.gold.toLocaleString()}g
                        </span>
                        {isActive && <ShieldCheck size={16} className="text-cyan" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlayer(player.id);
                          }}
                          className="btn-fantasy btn-danger"
                          style={{
                            padding: "2px 6px",
                            fontSize: "0.75rem",
                            borderRadius: "4px",
                            lineHeight: "1.2",
                            cursor: "pointer",
                            border: "1px solid var(--error-crimson)"
                          }}
                          title="Remove Character"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
                Select an existing character sheet to enter the marketplace.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "Cinzel", textAlign: "center", marginBottom: "0.5rem", color: "var(--gold)" }}>
                Forge a New Identity
              </h3>

              <div className="fantasy-form-group">
                <label htmlFor="char-name">Character Name</label>
                <input
                  type="text"
                  id="char-name"
                  className="fantasy-input"
                  placeholder="e.g. Thorin Oakshield"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  required
                />
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="char-title">Class / Title</label>
                <select
                  id="char-title"
                  className="fantasy-select"
                  value={charTitle}
                  onChange={(e) => setCharTitle(e.target.value)}
                >
                  <option value="Novice Adventurer">Novice Adventurer</option>
                  <option value="Rogue Thief">Rogue Thief</option>
                  <option value="Grand Sorcerer">Grand Sorcerer</option>
                  <option value="High Paladin">High Paladin</option>
                  <option value="Beast Hunter">Beast Hunter</option>
                  <option value="Hedge Wizard">Hedge Wizard</option>
                  <option value="Master Blacksmith">Master Blacksmith</option>
                </select>
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="char-server">Realm Server</label>
                <select
                  id="char-server"
                  className="fantasy-select"
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                >
                  <option value="Azeroth-1">Azeroth-1</option>
                  <option value="ShadowRealm">ShadowRealm</option>
                  <option value="DragonPeak">DragonPeak</option>
                  <option value="TitanValley">TitanValley</option>
                </select>
              </div>

              <div className="fantasy-form-group">
                <label htmlFor="char-gold">Starting Coin (Gold)</label>
                <input
                  type="number"
                  id="char-gold"
                  className="fantasy-input"
                  value={startingGold}
                  onChange={(e) => setStartingGold(e.target.value)}
                  min="100"
                  max="50000"
                  required
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Maximum starts at 50,000g. Bank allowance scales as 3x starting gold.
                </span>
              </div>

              {errorMsg && (
                <div style={{ color: "var(--error-crimson)", fontSize: "0.9rem", textAlign: "center" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-fantasy btn-success" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
                <Swords size={18} />
                <span>Create and Sign In</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
