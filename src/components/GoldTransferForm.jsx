import { useState } from "react";
import { useGuild } from "../context/GuildContext";
import { Coins, Send } from "lucide-react";
import { ValidationAlert } from "./ValidationAlert";

export const GoldTransferForm = () => {
  const { players, transferGold } = useGuild();
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const sender = players.find(p => p.id === senderId);
  const receiver = players.find(p => p.id === receiverId);
  const transferAmount = parseInt(amount) || 0;

  // Real-time validations
  let validationError = "";
  let isSubmitDisabled = true;

  if (senderId && receiverId && amount) {
    if (senderId === receiverId) {
      validationError = "Sender and receiver must be different players.";
    } else if (transferAmount <= 0) {
      validationError = "Please enter a positive amount of gold.";
    } else if (sender && sender.gold < transferAmount) {
      validationError = `Player ${sender.name} does not have enough gold.`;
    } else if (receiver && receiver.gold + transferAmount > receiver.bankLimit) {
      validationError = `This would exceed ${receiver.name}'s gold limit.`;
    } else {
      isSubmitDisabled = false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const success = transferGold(senderId, receiverId, transferAmount);
    if (success) {
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="medieval-panel" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div 
        style={{ 
          borderBottom: "1px double var(--bronze)", 
          paddingBottom: "8px", 
          marginBottom: "5px" 
        }}
      >
        <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Coins size={18} style={{ color: "var(--gold)" }} />
          <span>Transfer Gold</span>
        </h3>
      </div>

      {/* Select Sender */}
      <div className="fantasy-form-group">
        <label htmlFor="sender-select">Sender</label>
        <select
          id="sender-select"
          className="fantasy-select"
          value={senderId}
          onChange={(e) => {
            setSenderId(e.target.value);
            setAmount("");
          }}
          required
        >
          <option value="">-- Select Sender --</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.gold.toLocaleString()} gold)
            </option>
          ))}
        </select>
      </div>

      {/* Select Receiver */}
      <div className="fantasy-form-group">
        <label htmlFor="receiver-select">Receiver</label>
        <select
          id="receiver-select"
          className="fantasy-select"
          value={receiverId}
          onChange={(e) => {
            setReceiverId(e.target.value);
            setAmount("");
          }}
          required
        >
          <option value="">-- Select Receiver --</option>
          {players.map(p => (
            <option key={p.id} value={p.id} disabled={p.id === senderId}>
              {p.name} ({p.gold.toLocaleString()} gold / Limit: {p.bankLimit.toLocaleString()} gold)
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div className="fantasy-form-group">
        <label htmlFor="transfer-amount">Amount (Gold)</label>
        <div style={{ position: "relative" }}>
          <input
            id="transfer-amount"
            type="number"
            className="fantasy-input"
            placeholder="Amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", paddingLeft: "2.2rem" }}
            min="1"
            required
          />
          <span 
            style={{ 
              position: "absolute", 
              left: "12px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "var(--gold)",
              fontSize: "1.1rem" 
            }}
          >
            🪙
          </span>
        </div>
      </div>

      {/* Display Validation Error scroll */}
      {validationError && (
        <ValidationAlert message={validationError} type="error" />
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="btn-fantasy btn-success"
        style={{ 
          alignSelf: "flex-end", 
          marginTop: "10px",
          padding: "0.6rem 1.5rem" 
        }}
      >
        <Send size={14} />
        <span>Transfer Gold</span>
      </button>
    </form>
  );
};
