import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemCard } from "./ItemCard";

describe("ItemCard Component", () => {
  const mockItem = {
    id: "test-item-1",
    name: "Flame Sword",
    category: "Weapons",
    rarity: "Epic",
    price: 5000,
    quantity: 3,
    seller: "Archmage Vaelin",
    image: "⚔️"
  };

  test("renders item name, category, rarity, quantity and price", () => {
    render(
      <ItemCard 
        item={mockItem} 
        onSelect={vi.fn()} 
        onBuy={vi.fn()} 
        activePlayerName="Sir Galahad the Bold" 
      />
    );

    expect(screen.getByText("Flame Sword")).toBeInTheDocument();
    expect(screen.getByText("Weapons")).toBeInTheDocument();
    expect(screen.getByText("Epic")).toBeInTheDocument();
    expect(screen.getByText("Qty: 3")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  test("shows 'Your Listing' badge but keeps Buy button enabled for the seller/owner", () => {
    render(
      <ItemCard 
        item={mockItem} 
        onSelect={vi.fn()} 
        onBuy={vi.fn()} 
        activePlayerName="Archmage Vaelin" // Matches mockItem.seller
      />
    );

    const buyButton = screen.getByRole("button", { name: /buy/i });
    // Buy button is now enabled even for the owner (self-purchase is allowed)
    expect(buyButton).not.toBeDisabled();
    expect(screen.getByText("Your Listing")).toBeInTheDocument();
  });

  test("enables the Buy button if active player is not the owner", () => {
    render(
      <ItemCard 
        item={mockItem} 
        onSelect={vi.fn()} 
        onBuy={vi.fn()} 
        activePlayerName="Sir Galahad the Bold" // Different from seller
      />
    );

    const buyButton = screen.getByRole("button", { name: /buy/i });
    expect(buyButton).not.toBeDisabled();
  });

  test("calls onSelect and onBuy callbacks when buttons are clicked", () => {
    const onSelectMock = vi.fn();
    const onBuyMock = vi.fn();

    render(
      <ItemCard 
        item={mockItem} 
        onSelect={onSelectMock} 
        onBuy={onBuyMock} 
        activePlayerName="Sir Galahad the Bold"
      />
    );

    const inspectButton = screen.getByRole("button", { name: /inspect/i });
    const buyButton = screen.getByRole("button", { name: /buy/i });

    fireEvent.click(inspectButton);
    expect(onSelectMock).toHaveBeenCalledWith(mockItem);

    fireEvent.click(buyButton);
    expect(onBuyMock).toHaveBeenCalledWith(mockItem.id);
  });
});
