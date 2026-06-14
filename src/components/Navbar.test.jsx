import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { GuildProvider } from "../context/GuildContext";
import { ThemeProvider } from "../context/ThemeContext";

describe("Navbar Component", () => {
  test("renders logo, player stats, active player indicator, and theme button", () => {
    render(
      <GuildProvider>
        <ThemeProvider>
          <Navbar onToggleSidebar={vi.fn()} isSidebarOpen={false} />
        </ThemeProvider>
      </GuildProvider>
    );

    // Assert main header text
    expect(screen.getByText("LOOTGAZER")).toBeInTheDocument();
    
    // Assert active player details (Defaults to Galahad 14,500)
    expect(screen.getByText("Active Player")).toBeInTheDocument();
    expect(screen.getByText("Sir Galahad the Bold (Grandmaster Knight)")).toBeInTheDocument();
    expect(screen.getByText("14,500")).toBeInTheDocument();
    
    // Assert Total Gold in circulation exists
    expect(screen.getByText(/Total Gold in Circulation/i)).toBeInTheDocument();
  });

  test("triggers onToggleSidebar when hamburger button is clicked", () => {
    const toggleSidebarMock = vi.fn();
    
    render(
      <GuildProvider>
        <ThemeProvider>
          <Navbar onToggleSidebar={toggleSidebarMock} isSidebarOpen={false} />
        </ThemeProvider>
      </GuildProvider>
    );

    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    expect(toggleSidebarMock).toHaveBeenCalled();
  });
});
