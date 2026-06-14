import { useState, useEffect } from "react";
import { GuildProvider } from "./context/GuildContext";
import { useTheme } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/Toast";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { TradingHall } from "./pages/TradingHall";
import { AuctionLedger } from "./pages/AuctionLedger";
import { TradeLedger } from "./pages/TradeLedger";
import { InventoryFinder } from "./pages/InventoryFinder";
import { KingdomNetwork } from "./pages/KingdomNetwork";
import { RoyalTreasury } from "./pages/RoyalTreasury";
import { GlobalTradeHub } from "./pages/GlobalTradeHub";
import { LoginSignup } from "./pages/LoginSignup";

const getInitialPage = () => {
  const path = window.location.pathname;
  if (path === "/global-trade-hub") return "global-trade-hub";
  if (path === "/login") return "login";
  const hash = window.location.hash;
  if (hash === "#/global-trade-hub" || hash === "#global-trade-hub") return "global-trade-hub";
  if (hash === "#/login" || hash === "#login") return "login";
  
  if (path === "/marketplace" || hash.includes("marketplace")) return "marketplace";
  if (path === "/auctions" || hash.includes("auctions")) return "auctions";
  if (path === "/ledger" || hash.includes("ledger")) return "ledger";
  if (path === "/inventory" || hash.includes("inventory")) return "inventory";
  if (path === "/network" || hash.includes("network")) return "network";
  if (path === "/treasury" || hash.includes("treasury")) return "treasury";
  
  return "dashboard";
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const routeMap = {
      dashboard: "/",
      marketplace: "/marketplace",
      auctions: "/auctions",
      ledger: "/ledger",
      inventory: "/inventory",
      network: "/network",
      treasury: "/treasury",
      "global-trade-hub": "/global-trade-hub",
      login: "/login"
    };
    const newPath = routeMap[page] || "/";
    window.history.pushState(null, "", newPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Floating Particles on Canvas (AAA cinematic effect) - adapts color dynamically by theme
  useEffect(() => {
    const canvas = document.getElementById("ember-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particles = [];
    const maxParticles = 50;

    class Particle {
      constructor() {
        this.reset();
        // Scatter initially across heights
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.4 + 0.1;
        
        // Particle colors adapt to the active theme (day vs dusk/night)
        const colorSeed = Math.random();
        if (theme === "light") {
          // Sunny festive day: sky blue, gold/amber, and spring green confetti particles
          if (colorSeed < 0.4) this.color = "#0E7F87"; // Sky Blue/Teal
          else if (colorSeed < 0.7) this.color = "#D77A38"; // Warm Amber
          else this.color = "#5BB75B"; // Leaf Green
        } else {
          // Sunset dusk: glowing cyan, deep copper, warm orange embers
          if (colorSeed < 0.5) this.color = "#3CE2E2"; // Glowing Ice Teal
          else if (colorSeed < 0.8) this.color = "#D77A38"; // Glowing Copper
          else this.color = "#FF8C00"; // Warm Orange
        }
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Fade out as they rise high
        if (this.y < canvas.height * 0.2) {
          this.opacity -= 0.003;
        }

        if (this.y < 0 || this.opacity <= 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Rebuild when theme toggles to immediately update colors

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handlePageChange} />;
      case "marketplace":
        return <TradingHall />;
      case "auctions":
        return <AuctionLedger />;
      case "ledger":
        return <TradeLedger />;
      case "inventory":
        return <InventoryFinder />;
      case "network":
        return <KingdomNetwork />;
      case "treasury":
        return <RoyalTreasury />;
      case "global-trade-hub":
        return <GlobalTradeHub />;
      case "login":
        return <LoginSignup onLoginSuccess={() => setIsLoggedIn(true)} />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        {/* Background Canvas Particles */}
        <canvas id="ember-canvas" className="ember-canvas" />

        <header 
          style={{
            backgroundColor: "var(--surface-dark)",
            borderBottom: "3px solid var(--bronze)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            padding: "1rem 2rem",
            zIndex: 100,
            position: "sticky",
            top: 0
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.08em", color: "var(--gold)" }}>LOOTGAZER</h1>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Cinzel", letterSpacing: "0.1em" }}>
              Fantasy Item Marketplace
            </span>
          </div>
        </header>

        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10, minWidth: 0 }}>
          <LoginSignup onLoginSuccess={() => {
            setIsLoggedIn(true);
            if (currentPage === "login") {
              handlePageChange("dashboard");
            }
          }} />
        </main>

        <Footer />
        <ToastContainer />
      </div>
    );
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    handlePageChange("login");
  };

  return (
    <div className="app-container">
      {/* Background Canvas Particles */}
      <canvas id="ember-canvas" className="ember-canvas" />

      {/* Header Crest */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} onLogout={handleLogout} />

      {/* Main split */}
      <div className="main-content" style={{ position: "relative", zIndex: 10 }}>
        {/* Sidebar Navigation - handles desktop and mobile drawer modes */}
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={(page) => {
            handlePageChange(page);
            setIsSidebarOpen(false); // Auto-close on page switch
          }} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Content Portal */}
        <main style={{ flex: 1, position: "relative", minWidth: 0 }}>
          {renderPage()}
        </main>
      </div>

      {/* Footer sign */}
      <Footer />

      {/* Global alert messages */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <GuildProvider>
      <AppContent />
    </GuildProvider>
  );
}

export default App;
