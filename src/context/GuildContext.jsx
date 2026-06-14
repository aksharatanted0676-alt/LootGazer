import React, { createContext, useState, useEffect, useContext } from "react";
import { initialItems, initialPlayers, initialTrades, initialAuctions } from "../data/mockData";

const GuildContext = createContext();

export const GuildProvider = ({ children }) => {
  const getPlayerServer = (playerName) => {
    const fallbackServers = {
      "Sir Galahad the Bold": "Azeroth-1",
      "Lady Elaria Swift": "DragonPeak",
      "Grimnir Ironbreaker": "TitanValley",
      "Zephyr the Rogue": "ShadowRealm",
      "Archmage Vaelin": "Azeroth-1"
    };
    if (fallbackServers[playerName]) return fallbackServers[playerName];
    const servers = ["Azeroth-1", "ShadowRealm", "DragonPeak", "TitanValley"];
    let hash = 0;
    for (let i = 0; i < playerName.length; i++) {
      hash = playerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return servers[Math.abs(hash) % servers.length];
  };

  const getInitialEvents = () => {
    const events = [];
    
    // Process initial trades
    initialTrades.forEach((trade, index) => {
      const timestamp = new Date(trade.timestamp);
      if (trade.status === "Completed") {
        events.push({
          id: `init-evt-p-${index}`,
          type: "PURCHASE",
          server: getPlayerServer(trade.buyer),
          player: trade.buyer,
          item: trade.item,
          gold: trade.amount,
          timestamp
        });
        events.push({
          id: `init-evt-s-${index}`,
          type: "SALE",
          server: getPlayerServer(trade.seller),
          player: trade.seller,
          item: trade.item,
          gold: trade.amount,
          timestamp
        });
      } else if (trade.status === "Reversed") {
        events.push({
          id: `init-evt-r-${index}`,
          type: "REVERSAL",
          server: getPlayerServer(trade.buyer),
          player: trade.buyer,
          item: trade.item,
          gold: trade.amount,
          timestamp
        });
      }
    });

    // Process initial auctions
    initialAuctions.forEach((auction, index) => {
      const timestamp = new Date(auction.submissionTime);
      events.push({
        id: `init-evt-a-${index}`,
        type: "AUCTION_CREATED",
        server: getPlayerServer(auction.seller),
        player: auction.seller,
        item: auction.item,
        gold: auction.price,
        timestamp
      });
    });

    return events.sort((a, b) => b.timestamp - a.timestamp);
  };

  const [items, setItems] = useState(initialItems);
  const [players, setPlayers] = useState(() => {
    try {
      const stored = localStorage.getItem('lootgazer-players');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore parse errors
    }
    // Fallback to initial players with server assignment
    return initialPlayers.map(p => ({
      ...p,
      server: getPlayerServer(p.name)
    }));
  });
  
  // Persistence handled later in the file

  const [trades, setTrades] = useState(initialTrades);
  const [auctions, setAuctions] = useState(initialAuctions);
  const [globalEvents, setGlobalEvents] = useState(() => getInitialEvents());
  
  const broadcastEvent = React.useCallback((eventData) => {
    const newEvent = {
      id: eventData.id || "evt-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now(),
      timestamp: eventData.timestamp || new Date(),
      ...eventData
    };
    setGlobalEvents(prev => [newEvent, ...prev]);
  }, []);
  const [activePlayerId, setActivePlayerId] = useState("player-1"); // Sir Galahad the Bold
  const [feed, setFeed] = useState(() => [
    {
      id: "feed-1",
      message: "The trading hall is open. Welcome, adventurers.",
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString()
    },
    {
      id: "feed-2",
      message: "The Royal Treasury has verified the vault security settings.",
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString()
    }
  ]);
  const [toasts, setToasts] = useState([]);

  // Stats Counters
  const [totalTradesToday, setTotalTradesToday] = useState(initialTrades.length);

  // Active Player Helper
  const activePlayer = players.find(p => p.id === activePlayerId) || players[0];

  // Toast System
  const addToast = (message, type = "success") => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add message to Kingdom Feed
  const addFeedMessage = (message) => {
    const id = "feed-" + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString();
    setFeed(prev => [
      { id, message, timestamp },
      ...prev.slice(0, 49) // Keep last 50 entries
    ]);
  };

  // Buy Item Action
  const buyItem = (itemId, buyerId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) {
      addToast("Item not found in trading hall!", "error");
      return false;
    }

    const buyer = players.find(p => p.id === buyerId);
    if (!buyer) {
      addToast("Adventurer not found!", "error");
      return false;
    }

    if (buyer.gold < item.price) {
      addToast("You do not have enough Gold!", "error");
      return false;
    }

    // Find seller player object to adjust gold
    const sellerPlayer = players.find(p => p.name === item.seller);
    
    // Check seller bank limit (only if buyer is not the seller)
    if (item.seller !== buyer.name && sellerPlayer && sellerPlayer.gold + item.price > sellerPlayer.bankLimit) {
      addToast(`Purchase failed. The gold would exceed ${item.seller}'s bank limit!`, "error");
      addFeedMessage(`Royal Audit: Purchase of ${item.name} cancelled. Seller ${item.seller}'s bank limit would be exceeded.`);
      return false;
    }

    // Deduct gold from buyer, add to seller (if exists in players list)
    setPlayers(prev => prev.map(p => {
      let newGold = p.gold;
      if (p.id === buyer.id) {
        newGold -= item.price;
      }
      if (sellerPlayer && p.id === sellerPlayer.id) {
        newGold += item.price;
      }
      if (p.id === buyer.id || (sellerPlayer && p.id === sellerPlayer.id)) {
        return { ...p, gold: newGold };
      }
      return p;
    }));

    // Update item quantity
    setItems(prev => {
      return prev.map(i => {
        if (i.id === itemId) {
          return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      }).filter(i => i.quantity > 0); // Remove from list if quantity becomes 0
    });

    // Add to Trade Ledger
    const newTradeId = "T-" + (1000 + trades.length + 1);
    const newTrade = {
      tradeId: newTradeId,
      buyer: buyer.name,
      seller: item.seller,
      item: item.name,
      amount: item.price,
      timestamp: new Date().toISOString(),
      status: "Completed"
    };

    setTrades(prev => [newTrade, ...prev]);
    setTotalTradesToday(prev => prev + 1);

    const buyerServer = getPlayerServer(buyer.name);
    const sellerServer = getPlayerServer(item.seller);

    broadcastEvent({
      type: "PURCHASE",
      server: buyerServer,
      player: buyer.name,
      item: item.name,
      gold: item.price
    });

    broadcastEvent({
      type: "SALE",
      server: sellerServer,
      player: item.seller,
      item: item.name,
      gold: item.price
    });

    // Notify Feed and Toast
    addFeedMessage(`💰 ${buyer.name} bought "${item.name}" from ${item.seller} for ${item.price} Gold.`);
    addToast(`Bought ${item.name}!`, "success");
    return true;
  };

  // Safe Trade Reversal Action
  const reverseTrade = (tradeId) => {
    const tradeIndex = trades.findIndex(t => t.tradeId === tradeId);
    if (tradeIndex === -1) {
      addToast("Trade not found!", "error");
      return;
    }

    const trade = trades[tradeIndex];
    if (trade.status !== "Completed") {
      addToast("This trade has already been reversed!", "error");
      return;
    }

    // Find buyer and seller player objects
    const buyerPlayer = players.find(p => p.name === trade.buyer);
    const sellerPlayer = players.find(p => p.name === trade.seller);

    // Check if seller has enough gold to return
    if (sellerPlayer && sellerPlayer.gold < trade.amount) {
      addToast(`Reversal failed! Seller ${trade.seller} does not have ${trade.amount} Gold.`, "error");
      return;
    }

    // Check if returning gold to buyer exceeds buyer's bank limit
    if (buyerPlayer && buyerPlayer.gold + trade.amount > buyerPlayer.bankLimit) {
      addToast(`Reversal failed! Returning gold exceeds Buyer ${trade.buyer}'s bank limit.`, "error");
      return;
    }

    // Process reversal in state
    setPlayers(prev => prev.map(p => {
      if (buyerPlayer && p.id === buyerPlayer.id) {
        return { ...p, gold: p.gold + trade.amount };
      }
      if (sellerPlayer && p.id === sellerPlayer.id) {
        return { ...p, gold: p.gold - trade.amount };
      }
      return p;
    }));

    // Return the item to seller
    setItems(prev => {
      const existingItem = prev.find(i => i.name === trade.item && i.seller === trade.seller);
      if (existingItem) {
        return prev.map(i => {
          if (i.id === existingItem.id) {
            return { ...i, quantity: i.quantity + 1 };
          }
          return i;
        });
      } else {
        // Find reference details from original items if possible, otherwise create new card
        const refItem = initialItems.find(i => i.name === trade.item) || {
          category: "Relics",
          rarity: "Rare",
          attack: 10,
          defense: 10,
          durability: 80,
          image: "📦",
          description: "An item returned from a reversed trade."
        };
        const restoredItem = {
          id: "restored-" + Math.random().toString(36).substring(2, 9),
          name: trade.item,
          category: refItem.category,
          rarity: refItem.rarity,
          price: trade.amount,
          quantity: 1,
          seller: trade.seller,
          attack: refItem.attack,
          defense: refItem.defense,
          durability: refItem.durability,
          description: refItem.description,
          tradesCount: 1,
          image: refItem.image
        };
        return [...prev, restoredItem];
      }
    });

    // Update trade status in list
    setTrades(prev => prev.map(t => {
      if (t.tradeId === tradeId) {
        return { ...t, status: "Reversed" };
      }
      return t;
    }));

    const buyerServer = getPlayerServer(trade.buyer);
    broadcastEvent({
      type: "REVERSAL",
      server: buyerServer,
      player: trade.buyer,
      item: trade.item,
      gold: trade.amount
    });

    addFeedMessage(`⚔️ [REVERSAL] Trade ${tradeId} has been reversed. ${trade.amount} Gold returned to ${trade.buyer}.`);
    addToast(`Trade ${tradeId} has been reversed.`, "success");
  };

  // Add Item to Auction Queue (FIFO)
  const addAuction = (itemName, price, sellerName) => {
    // Determine position (length of active auctions + 1)
    const newAuctionId = "A-" + (500 + auctions.length + 1);
    const newAuction = {
      auctionId: newAuctionId,
      seller: sellerName,
      item: itemName,
      price: parseInt(price),
      position: auctions.filter(a => a.status === "Active").length + 1,
      submissionTime: new Date().toISOString(),
      status: "Active"
    };

    setAuctions(prev => [...prev, newAuction]);

    const sellerServer = getPlayerServer(sellerName);
    broadcastEvent({
      type: "AUCTION_CREATED",
      server: sellerServer,
      player: sellerName,
      item: itemName,
      gold: parseInt(price)
    });

    addFeedMessage(`📜 ${sellerName} listed "${itemName}" for auction at starting bid of ${price} Gold.`);
    addToast(`Listed "${itemName}" in the auction queue.`, "success");
  };

  // Cancel Auction Action
  const cancelAuction = (auctionId) => {
    setAuctions(prev => {
      const filtered = prev.map(a => {
        if (a.auctionId === auctionId) {
          return { ...a, status: "Cancelled" };
        }
        return a;
      });

      // Recalculate positions of remaining active auctions
      let activeIndex = 1;
      return filtered.map(a => {
        if (a.status === "Active") {
          return { ...a, position: activeIndex++ };
        }
        return a;
      });
    });

    const target = auctions.find(a => a.auctionId === auctionId);
    if (target) {
      addFeedMessage(`❌ ${target.seller} cancelled the auction for "${target.item}".`);
      addToast(`Auction for "${target.item}" cancelled.`, "warning");
    }
  };

  // Process First Active Auction (FIFO Pop)
  const processNextAuction = () => {
    const nextActive = auctions.find(a => a.status === "Active");
    if (!nextActive) return;

    // Find a buyer player who is NOT the seller and has enough gold
    const possibleBuyers = players.filter(p => p.name !== nextActive.seller && p.gold >= nextActive.price);
    if (possibleBuyers.length === 0) {
      addFeedMessage(`⚠️ The auction for "${nextActive.item}" ended with no bids.`);
      // Set to expired
      setAuctions(prev => {
        const updated = prev.map(a => {
          if (a.auctionId === nextActive.auctionId) return { ...a, status: "Expired" };
          return a;
        });
        let idx = 1;
        return updated.map(a => {
          if (a.status === "Active") return { ...a, position: idx++ };
          return a;
        });
      });
      return;
    }

    // Select random buyer
    const buyer = possibleBuyers[Math.floor(Math.random() * possibleBuyers.length)];
    const sellerPlayer = players.find(p => p.name === nextActive.seller);

    // Verify bank limits
    if (sellerPlayer && sellerPlayer.gold + nextActive.price > sellerPlayer.bankLimit) {
      addFeedMessage(`⚠️ Auction for "${nextActive.item}" stopped. Seller's bank limit would be exceeded.`);
      return;
    }

    // Process transfer
    setPlayers(prev => prev.map(p => {
      if (p.id === buyer.id) return { ...p, gold: p.gold - nextActive.price };
      if (sellerPlayer && p.id === sellerPlayer.id) return { ...p, gold: p.gold + nextActive.price };
      return p;
    }));

    // Update Auction status
    setAuctions(prev => {
      const updated = prev.map(a => {
        if (a.auctionId === nextActive.auctionId) return { ...a, status: "Completed" };
        return a;
      });
      let idx = 1;
      return updated.map(a => {
        if (a.status === "Active") return { ...a, position: idx++ };
        return a;
      });
    });

    // Add to trades
    const newTradeId = "T-" + (1000 + trades.length + 1);
    const newTrade = {
      tradeId: newTradeId,
      buyer: buyer.name,
      seller: nextActive.seller,
      item: nextActive.item,
      amount: nextActive.price,
      timestamp: new Date().toISOString(),
      status: "Completed"
    };

    setTrades(prev => [newTrade, ...prev]);
    setTotalTradesToday(prev => prev + 1);

    const buyerServer = getPlayerServer(buyer.name);
    const sellerServer = getPlayerServer(nextActive.seller);

    broadcastEvent({
      type: "PURCHASE",
      server: buyerServer,
      player: buyer.name,
      item: nextActive.item,
      gold: nextActive.price
    });

    broadcastEvent({
      type: "SALE",
      server: sellerServer,
      player: nextActive.seller,
      item: nextActive.item,
      gold: nextActive.price
    });

    addFeedMessage(`⚖️ [AUCTION SOLD] "${nextActive.item}" bought by ${buyer.name} from ${nextActive.seller} for ${nextActive.price} Gold.`);
    addToast(`Auction completed: ${nextActive.item} sold for ${nextActive.price} Gold.`, "success");
  };

  // Transfer Gold (Royal Treasury Form)
  const transferGold = (senderId, receiverId, amount) => {
    const sender = players.find(p => p.id === senderId);
    const receiver = players.find(p => p.id === receiverId);
    const goldAmount = parseInt(amount);

    if (!sender || !receiver) {
      addToast("Adventurer not found!", "error");
      return false;
    }

    if (senderId === receiverId) {
      addToast("You cannot transfer gold to yourself!", "error");
      return false;
    }

    if (sender.gold < goldAmount) {
      addToast(`${sender.name} does not have enough Gold!`, "error");
      return false;
    }

    if (receiver.gold + goldAmount > receiver.bankLimit) {
      addToast("Transfer Exceeds Royal Treasury Allowance", "error");
      return false;
    }

    // Process Gold transfer
    setPlayers(prev => prev.map(p => {
      if (p.id === senderId) return { ...p, gold: p.gold - goldAmount };
      if (p.id === receiverId) return { ...p, gold: p.gold + goldAmount };
      return p;
    }));

    const senderServer = getPlayerServer(sender.name);
    broadcastEvent({
      type: "TRANSFER",
      server: senderServer,
      player: sender.name,
      item: `Gold Transfer to ${receiver.name}`,
      gold: goldAmount
    });

    addFeedMessage(`🏦 [TRANSFER] ${sender.name} transferred ${goldAmount} Gold to ${receiver.name}.`);
    addToast(`Gold transfer complete!`, "success");
    return true;
  };

  // Add Item Card to marketplace listings (form submission helper)
  const addMarketItem = (itemDetails) => {
    const newItem = {
      id: "item-" + (items.length + 1) + "-" + Math.random().toString(36).substring(2, 5),
      ...itemDetails,
      quantity: 1,
      tradesCount: 0,
      image: itemDetails.category === "Weapons" ? "⚔️" :
             itemDetails.category === "Shields" ? "🛡️" :
             itemDetails.category === "Armor" ? "🥋" :
             itemDetails.category === "Relics" ? "💍" : "🧪"
    };

    setItems(prev => [...prev, newItem]);
    addFeedMessage(`🛍️ ${itemDetails.seller} listed a new item: "${itemDetails.name}" for ${itemDetails.price} Gold.`);
    addToast(`Listed "${itemDetails.name}" in the marketplace.`, "success");
  };

  // Kingdom-wide Trade Network Simulation Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEventSeed = Math.random();

      if (randomEventSeed < 0.25) {
        // Event A: Simulate price changes
        if (items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          const item = items[randomIndex];
          const priceChange = Math.random() > 0.5 ? 1.05 : 0.95;
          const newPrice = Math.max(10, Math.round(item.price * priceChange));
          
          setItems(prev => prev.map(i => {
            if (i.id === item.id) return { ...i, price: newPrice };
            return i;
          }));
          
          addFeedMessage(`📈 Market Alert: The price of "${item.name}" updated to ${newPrice} Gold.`);
        }
      } 
      else if (randomEventSeed < 0.45) {
        // Event B: FIFO Auction progression simulation
        const activeAuctions = auctions.filter(a => a.status === "Active");
        if (activeAuctions.length > 0) {
          processNextAuction();
        } else {
          // Add a random auction to keep queue alive
          const randomPlayer = players[Math.floor(Math.random() * players.length)];
          const randomItem = initialItems[Math.floor(Math.random() * initialItems.length)];
          addAuction(randomItem.name, Math.round(randomItem.price * 0.9), randomPlayer.name);
        }
      } 
      else if (randomEventSeed < 0.65) {
        // Event C: Simulates a random player purchase
        const randomBuyer = players[Math.floor(Math.random() * players.length)];
        const sellableItems = items.filter(i => i.seller !== randomBuyer.name);
        
        if (sellableItems.length > 0) {
          const randomItem = sellableItems[Math.floor(Math.random() * sellableItems.length)];
          if (randomBuyer.gold >= randomItem.price) {
            buyItem(randomItem.id, randomBuyer.id);
          }
        }
      } 
      else if (randomEventSeed < 0.85) {
        // Event D: Kingdom Lore / Flavor text
        const loreWhispers = [
          "Whispers: A sleeping dragon was sighted near the Misty Mountains.",
          "Guild Gazette: The Council is lowering tariffs on all armor trades.",
          "Warden Alert: Keep your coin pouches close in the tavern today.",
          "Treasury Report: Minting of new Gold coins has stabilized market rates.",
          "Lady Elaria: 'Demand for Phoenix feathers has increased across the realm.'"
        ];
        const randomLore = loreWhispers[Math.floor(Math.random() * loreWhispers.length)];
        addFeedMessage(`📣 ${randomLore}`);
      }
    }, 12000); // Trigger simulation every 12 seconds to keep it active but not overwhelming

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, players, auctions, trades]);

// Persist players to localStorage
useEffect(() => {
  try {
    localStorage.setItem('lootgazer-players', JSON.stringify(players));
  } catch {
    // ignore storage errors
  }
}, [players]);

  const registerPlayer = React.useCallback((newPlayer) => {
    setPlayers(prev => [...prev, newPlayer]);
  }, []);

  const removePlayer = React.useCallback((playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    setActivePlayerId(prev => (prev === playerId ? "player-1" : prev));
  }, []);

  return (
    <GuildContext.Provider
      value={{
        items,
        players,
        trades,
        auctions,
        activePlayerId,
        setActivePlayerId,
        activePlayer,
        feed,
        toasts,
        addToast,
        removeToast,
        addFeedMessage,
        buyItem,
        reverseTrade,
        addAuction,
        cancelAuction,
        transferGold,
        addMarketItem,
        totalTradesToday,
        globalEvents,
        broadcastEvent,
        registerPlayer,
        removePlayer
      }}
    >
      {children}
    </GuildContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGuild = () => useContext(GuildContext);
