import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("fails", () => {
    render(<App />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
