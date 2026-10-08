// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DOM test setup", () => {
  it("renders accessible React content", () => {
    render(<h1>Test environment ready</h1>);

    expect(
      screen.getByRole("heading", { name: "Test environment ready" })
    ).toBeInTheDocument();
  });
});
