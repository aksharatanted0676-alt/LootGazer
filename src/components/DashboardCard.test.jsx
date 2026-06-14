import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardCard } from "./DashboardCard";
import { Sparkles } from "lucide-react";

describe("DashboardCard Component", () => {
  test("renders title, value, and subtext correctly", () => {
    render(
      <DashboardCard 
        title="Active Bids" 
        value="42" 
        subtext="3 ending soon" 
        icon={Sparkles} 
      />
    );

    expect(screen.getByText("Active Bids")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("3 ending soon")).toBeInTheDocument();
  });

  test("applies glowing class if glow prop is true", () => {
    const { container } = render(
      <DashboardCard 
        title="Treasure Level" 
        value="Legendary" 
        glow={true} 
      />
    );

    // medieval-panel is the base card layout
    const cardElement = container.querySelector(".medieval-panel");
    expect(cardElement).toHaveClass("glowing");
  });

  test("does not apply glowing class if glow prop is false", () => {
    const { container } = render(
      <DashboardCard 
        title="Treasure Level" 
        value="Common" 
        glow={false} 
      />
    );

    const cardElement = container.querySelector(".medieval-panel");
    expect(cardElement).not.toHaveClass("glowing");
  });
});
