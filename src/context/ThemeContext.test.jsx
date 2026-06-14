import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const TestThemeComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-btn" onClick={toggleTheme}>Toggle</button>
      <button data-testid="set-light-btn" onClick={() => setTheme("light")}>Set Light</button>
      <button data-testid="set-dark-btn" onClick={() => setTheme("dark")}>Set Dark</button>
    </div>
  );
};

describe("ThemeContext System", () => {
  beforeEach(() => {
    // Fully mock localStorage for the test context
    const store = {};
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { for (const key in store) delete store[key]; },
        removeItem: (key) => { delete store[key]; }
      },
      writable: true,
      configurable: true
    });
    
    document.documentElement.removeAttribute("data-theme");
  });

  test("defaults to dark theme and sets data-theme attribute on mount", () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("toggleTheme updates state, attribute, and localStorage", () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId("toggle-btn");

    // Toggle once -> goes to light
    act(() => {
      toggleBtn.click();
    });

    expect(screen.getByTestId("current-theme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("lootgazer-theme")).toBe("light");

    // Toggle twice -> goes back to dark
    act(() => {
      toggleBtn.click();
    });

    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("lootgazer-theme")).toBe("dark");
  });

  test("setTheme forces specific theme state", () => {
    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>
    );

    const setLightBtn = screen.getByTestId("set-light-btn");
    const setDarkBtn = screen.getByTestId("set-dark-btn");

    act(() => {
      setLightBtn.click();
    });
    expect(screen.getByTestId("current-theme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    act(() => {
      setDarkBtn.click();
    });
    expect(screen.getByTestId("current-theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
