import { useGuild } from "../context/GuildContext";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useGuild();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-message ${toast.type}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {toast.type === "success" && <CheckCircle size={18} color="var(--success-emerald)" />}
            {toast.type === "error" && <AlertCircle size={18} color="var(--error-crimson)" />}
            {toast.type === "warning" && <Info size={18} color="var(--warning-amber)" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginLeft: "15px"
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
