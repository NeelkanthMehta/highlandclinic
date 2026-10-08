// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card primitives", () => {
  it("renders the card structure and forwards accessible content", () => {
    render(
      <Card aria-label="Appointment summary">
        <CardTitle>Visit details</CardTitle>
        <CardHeader>Appointment</CardHeader>
        <CardDescription>Confirmed consultation</CardDescription>
        <CardAction>Manage</CardAction>
        <CardContent>Cardiology consultation</CardContent>
        <CardFooter>Call the clinic for assistance.</CardFooter>
      </Card>
    );

    expect(screen.getByLabelText("Appointment summary")).toHaveAttribute(
      "data-slot",
      "card"
    );
    expect(screen.getByText("Visit details")).toBeInTheDocument();
    expect(screen.getByText("Cardiology consultation")).toBeInTheDocument();
  });
});
