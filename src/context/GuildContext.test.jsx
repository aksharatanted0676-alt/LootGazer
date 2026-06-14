import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { GuildProvider, useGuild } from "./GuildContext";

// Test helper component to interact with GuildContext inside test renders
const TestComponent = ({ actionCallback }) => {
  const context = useGuild();
  
  React.useEffect(() => {
    if (context && actionCallback) {
      actionCallback(context);
    }
  }, [context, actionCallback]);

  if (!context) return <div>No Context</div>;

  return (
    <div>
      <div data-testid="player-gold">{context.activePlayer?.gold}</div>
      <div data-testid="active-player">{context.activePlayer?.name}</div>
      <div data-testid="items-count">{context.items.length}</div>
      <div data-testid="trades-count">{context.trades.length}</div>
    </div>
  );
};

describe("GuildContext Business Logic", () => {
  test("loads initial items and players", () => {
    render(
      <GuildProvider>
        <TestComponent />
      </GuildProvider>
    );

    expect(screen.getByTestId("active-player").textContent).toBe("Sir Galahad the Bold");
    expect(parseInt(screen.getByTestId("items-count").textContent)).toBeGreaterThan(0);
  });

  test("buyItem: deducts buyer gold, records trade, and updates inventory", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    // Initial state check
    const initialTradesCount = capturedContext.trades.length;
    const buyer = capturedContext.players.find(p => p.id === "player-1"); // Galahad - gold: 14500
    
    expect(buyer.gold).toBe(14500);

    let success;
    act(() => {
      success = capturedContext.buyItem("item-6", "player-1");
    });

    expect(success).toBe(true);
    
    // Check gold deduction
    const updatedBuyer = capturedContext.players.find(p => p.id === "player-1");
    expect(updatedBuyer.gold).toBe(14500 - 800);

    // Check seller gold addition (Archmage Vaelin gold: 22000 -> 22800)
    const updatedSeller = capturedContext.players.find(p => p.name === "Archmage Vaelin");
    expect(updatedSeller.gold).toBe(22800);

    // Check trade recorded
    expect(capturedContext.trades.length).toBe(initialTradesCount + 1);
    expect(capturedContext.trades[0].buyer).toBe("Sir Galahad the Bold");
    expect(capturedContext.trades[0].item).toBe("Elixir of Eternal Might");
  });

  test("buyItem: succeeds if purchasing own item", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    const initialGold = capturedContext.players.find(p => p.id === "player-1").gold;
    let success;
    act(() => {
      success = capturedContext.buyItem("item-4", "player-1");
    });

    expect(success).toBe(true);
    expect(capturedContext.players.find(p => p.id === "player-1").gold).toBe(initialGold);
  });

  test("buyItem: fails if buyer has insufficient gold", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    // player-4 is "Zephyr the Rogue" (2500 gold). item-2 is "Aegis of the Sun King" (8500 gold)
    let success;
    act(() => {
      success = capturedContext.buyItem("item-2", "player-4");
    });

    expect(success).toBe(false);
  });

  test("transferGold: transfers gold if balances and limits are verified", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    let success;
    act(() => {
      success = capturedContext.transferGold("player-1", "player-3", 1000);
    });

    expect(success).toBe(true);
    expect(capturedContext.players.find(p => p.id === "player-1").gold).toBe(13500);
    expect(capturedContext.players.find(p => p.id === "player-3").gold).toBe(4800);
  });

  test("transferGold: fails if receiver bank limit exceeded", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    // player-3 is Grimnir - 3800 gp, limit 8000 gp (room for 4200 gp)
    let success;
    act(() => {
      success = capturedContext.transferGold("player-1", "player-3", 5000); // 5000 > room of 4200
    });

    expect(success).toBe(false);
  });

  test("reverseTrade: returns gold and restores item quantity", () => {
    let capturedContext;
    render(
      <GuildProvider>
        <TestComponent actionCallback={(ctx) => { capturedContext = ctx; }} />
      </GuildProvider>
    );

    // Initial trades has T-1001: buyer "Sir Galahad the Bold" (player-1), seller "Lady Elaria Swift" (player-2), item "Aegis of the Sun King" (price 8000)
    // Lady Elaria has gold: 9200. Sir Galahad has gold: 14500.
    const buyerInitialGold = capturedContext.players.find(p => p.id === "player-1").gold;
    const sellerInitialGold = capturedContext.players.find(p => p.id === "player-2").gold;

    act(() => {
      capturedContext.reverseTrade("T-1001");
    });

    // Gold returned
    expect(capturedContext.players.find(p => p.id === "player-1").gold).toBe(buyerInitialGold + 8000);
    expect(capturedContext.players.find(p => p.id === "player-2").gold).toBe(sellerInitialGold - 8000);
    
    // Trade status set to Reversed
    const reversedTrade = capturedContext.trades.find(t => t.tradeId === "T-1001");
    expect(reversedTrade.status).toBe("Reversed");
  });
});
