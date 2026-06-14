import { useEffect } from "react";
import { describe, test, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { GuildProvider, useGuild } from "./GuildContext";

// Test Helper Component
const TestComponent = ({ actionCallback }) => {
  const context = useGuild();
  
  useEffect(() => {
    if (context && actionCallback) {
      actionCallback(context);
    }
  }, [context, actionCallback]);

  if (!context) return <div>No Context</div>;

  return (
    <div>
      <div data-testid="global-events-count">{context.globalEvents.length}</div>
      <div data-testid="active-player">{context.activePlayer?.name}</div>
    </div>
  );
};

describe("GuildContext Global Event System", () => {
  test("initializes globalEvents with historical events on mount", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    // Initial trades and auctions should be converted to events
    expect(capturedContext.globalEvents.length).toBeGreaterThan(0);
    
    // Check event properties
    const firstEvent = capturedContext.globalEvents[0];
    expect(firstEvent).toHaveProperty("id");
    expect(firstEvent).toHaveProperty("type");
    expect(firstEvent).toHaveProperty("server");
    expect(firstEvent).toHaveProperty("player");
    expect(firstEvent).toHaveProperty("item");
    expect(firstEvent).toHaveProperty("gold");
    expect(firstEvent).toHaveProperty("timestamp");
  });

  test("buyItem: broadcasts both a PURCHASE and a SALE event", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    const initialEventsCount = capturedContext.globalEvents.length;

    // buy item-6 (Elixir - cost: 800, seller: Archmage Vaelin) for player-1 (Galahad)
    act(() => {
      capturedContext.buyItem("item-6", "player-1");
    });

    // Check that two new events were added (one PURCHASE, one SALE)
    expect(capturedContext.globalEvents.length).toBe(initialEventsCount + 2);
    
    const purchaseEvent = capturedContext.globalEvents[1]; // Since sorted by date desc or prepended, let's look at the first two
    const saleEvent = capturedContext.globalEvents[0];

    const types = [purchaseEvent.type, saleEvent.type];
    expect(types).toContain("PURCHASE");
    expect(types).toContain("SALE");

    // Check specific purchase details
    const purchase = capturedContext.globalEvents.find(e => e.type === "PURCHASE" && e.player === "Sir Galahad the Bold");
    expect(purchase).toBeDefined();
    expect(purchase.item).toBe("Elixir of Eternal Might");
    expect(purchase.gold).toBe(800);
    expect(purchase.server).toBe("Azeroth-1");

    // Check specific sale details
    const sale = capturedContext.globalEvents.find(e => e.type === "SALE" && e.player === "Archmage Vaelin");
    expect(sale).toBeDefined();
    expect(sale.item).toBe("Elixir of Eternal Might");
    expect(sale.gold).toBe(800);
    expect(sale.server).toBe("Azeroth-1");
  });

  test("transferGold: broadcasts a TRANSFER event", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    const initialEventsCount = capturedContext.globalEvents.length;

    // transfer 500 gold from Galahad (player-1) to Grimnir (player-3)
    act(() => {
      capturedContext.transferGold("player-1", "player-3", 500);
    });

    expect(capturedContext.globalEvents.length).toBe(initialEventsCount + 1);
    
    const transferEvent = capturedContext.globalEvents[0];
    expect(transferEvent.type).toBe("TRANSFER");
    expect(transferEvent.player).toBe("Sir Galahad the Bold");
    expect(transferEvent.gold).toBe(500);
    expect(transferEvent.server).toBe("Azeroth-1");
  });

  test("reverseTrade: broadcasts a REVERSAL event", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    const initialEventsCount = capturedContext.globalEvents.length;

    // reverse T-1001 (buyer Sir Galahad the Bold, item Aegis of the Sun King, price 8000)
    act(() => {
      capturedContext.reverseTrade("T-1001");
    });

    expect(capturedContext.globalEvents.length).toBe(initialEventsCount + 1);

    const reversalEvent = capturedContext.globalEvents[0];
    expect(reversalEvent.type).toBe("REVERSAL");
    expect(reversalEvent.player).toBe("Sir Galahad the Bold");
    expect(reversalEvent.item).toBe("Aegis of the Sun King");
    expect(reversalEvent.gold).toBe(8000);
    expect(reversalEvent.server).toBe("Azeroth-1");
  });

  test("addAuction: broadcasts an AUCTION_CREATED event", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    const initialEventsCount = capturedContext.globalEvents.length;

    // add auction for Phoenix Feather Boots, price 3000, seller Lady Elaria Swift
    act(() => {
      capturedContext.addAuction("Phoenix Feather Boots", 3000, "Lady Elaria Swift");
    });

    expect(capturedContext.globalEvents.length).toBe(initialEventsCount + 1);

    const auctionEvent = capturedContext.globalEvents[0];
    expect(auctionEvent.type).toBe("AUCTION_CREATED");
    expect(auctionEvent.player).toBe("Lady Elaria Swift");
    expect(auctionEvent.item).toBe("Phoenix Feather Boots");
    expect(auctionEvent.gold).toBe(3000);
    expect(auctionEvent.server).toBe("DragonPeak");
  });
});
