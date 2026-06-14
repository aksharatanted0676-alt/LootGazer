import { describe, test, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { GuildProvider } from "../context/GuildContext";
import { LoginSignup } from "./LoginSignup";

describe("LoginSignup Component", () => {
  test("renders sign-in page with existing characters by default", () => {
    render(
      <GuildProvider>
        <LoginSignup />
      </GuildProvider>
    );

    // Existing characters should be displayed
    expect(screen.getByText("Sir Galahad the Bold")).toBeDefined();
    expect(screen.getByText("Lady Elaria Swift")).toBeDefined();
    expect(screen.getByText("Enter Tavern (Sign In)")).toBeDefined();
  });

  test("clicking a player button logs them in", () => {
    const mockOnLoginSuccess = vi.fn();
    render(
      <GuildProvider>
        <LoginSignup onLoginSuccess={mockOnLoginSuccess} />
      </GuildProvider>
    );

    const characterButton = screen.getByText("Sir Galahad the Bold").parentElement;
    act(() => {
      fireEvent.click(characterButton);
    });

    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });

  test("can toggle to sign-up mode and create a new character", () => {
    const mockOnLoginSuccess = vi.fn();
    render(
      <GuildProvider>
        <LoginSignup onLoginSuccess={mockOnLoginSuccess} />
      </GuildProvider>
    );

    // Click on New Character tab
    const signUpTab = screen.getByText("New Character (Sign Up)");
    act(() => {
      fireEvent.click(signUpTab);
    });

    // Verify fields are present
    expect(screen.getByLabelText("Character Name")).toBeDefined();
    expect(screen.getByLabelText("Class / Title")).toBeDefined();
    expect(screen.getByLabelText("Realm Server")).toBeDefined();
    
    // Fill out form
    const nameInput = screen.getByLabelText("Character Name");
    fireEvent.change(nameInput, { target: { value: "Orion Warrior" } });
    
    const submitBtn = screen.getByText("Create and Sign In");
    act(() => {
      fireEvent.click(submitBtn);
    });

    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });
});
