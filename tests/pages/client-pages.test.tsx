// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigation } = vi.hoisted(() => ({
  navigation: {
    query: "",
    router: { push: vi.fn(), refresh: vi.fn() },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => navigation.router,
  useSearchParams: () => new URLSearchParams(navigation.query),
}));

import SignUpPage from "@/app/sign-up/page";
import SignInPage from "@/app/sign-in/page";
import BookAppointmentPage from "@/app/book-appointment/page";

describe("client page flows", () => {
  beforeEach(() => {
    navigation.query = "";
    navigation.router.push.mockReset();
    navigation.router.refresh.mockReset();
  });

  it("validates matching signup passwords before making a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<SignUpPage />);
    await user.type(screen.getByPlaceholderText("e.g. Eleanor Vance"), "Eleanor Vance");
    await user.type(screen.getByPlaceholderText("e.g. eleanor@example.com"), "eleanor@example.com");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "secret1");
    await user.type(screen.getByPlaceholderText("Re-enter password"), "secret2");
    await user.click(screen.getByRole("button", { name: /create patient account/i }));

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends normalized form values and reports successful account creation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "patient-1" } }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<SignUpPage />);
    await user.type(screen.getByPlaceholderText("e.g. Eleanor Vance"), "  Eleanor Vance  ");
    await user.type(screen.getByPlaceholderText("e.g. eleanor@example.com"), "eleanor@example.com");
    await user.type(screen.getByPlaceholderText("+1 (555) 000-0000"), "555-0100");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "secret1");
    await user.type(screen.getByPlaceholderText("Re-enter password"), "secret1");
    await user.click(screen.getByRole("button", { name: /create patient account/i }));

    expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/sign-up",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Eleanor Vance",
          email: "eleanor@example.com",
          password: "secret1",
          phoneNumber: "555-0100",
          dateofbirth: "",
        }),
      })
    );
    await waitFor(
      () => expect(navigation.router.push).toHaveBeenCalledWith("/"),
      { timeout: 3000 }
    );
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  }, 10_000);

  it("shows sign-in API errors without navigating", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Invalid email or password" }),
      })
    );
    const user = userEvent.setup();
    render(<SignInPage />);

    await user.type(screen.getByPlaceholderText("e.g. name@example.com"), "pat@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong-password");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(navigation.router.push).not.toHaveBeenCalled();
  });

  it("shows a recoverable message when doctors cannot be loaded for booking", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<BookAppointmentPage />);

    expect(
      await screen.findByText("Failed to load doctors. Please refresh the page.")
    ).toBeInTheDocument();
  });

  it("completes guest booking from doctor selection through inline confirmation", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const doctor = {
      id: "doctor-1",
      name: "Dr. Riley",
      image: null,
      address: "Highland Clinic",
      doctorProfile: {
        specialty: "Cardiology",
        credentials: "MD",
        brief: "Heart health specialist",
        rating: 4.8,
        reviewCount: 12,
      },
    };
    const slot = {
      time: "15:00",
      startUTC: `${today}T15:00:00.000Z`,
      endUTC: `${today}T15:30:00.000Z`,
      isAvailable: true,
    };
    const confirmedAppointment = {
      appointmentId: "booking-123",
      doctor,
      patientName: "Jamie Guest",
      phoneNumber: "555-0100",
      appointmentStartUTC: slot.startUTC,
      appointmentEndUTC: slot.endUTC,
      paymentMethod: "CASH",
      status: "BOOKING_CONFIRMED",
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url === "/api/doctors") {
        return { ok: true, json: async () => ({ doctors: [doctor] }) };
      }
      if (url.startsWith("/api/doctors/")) {
        return { ok: true, json: async () => ({ slots: [slot] }) };
      }
      if (url === "/api/appointments" && init?.method === "POST") {
        return {
          ok: true,
          json: async () => ({ appointment: confirmedAppointment }),
        };
      }
      return {
        ok: true,
        json: async () => ({ error: "Unexpected request" }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    navigation.query = "doctorId=doctor-1";
    const user = userEvent.setup();

    render(<BookAppointmentPage />);

    await user.click(
      await screen.findByRole("button", { name: /proceed to schedule/i })
    );
    await user.click(await screen.findByRole("button", { name: /available/i }));
    await user.click(
      screen.getByRole("button", { name: /continue to patient details/i })
    );
    await user.type(screen.getByPlaceholderText("e.g. Jane Doe"), "Jamie Guest");
    await user.type(
      screen.getByPlaceholderText("e.g. +1 (555) 000-1234"),
      "555-0100"
    );
    await user.click(
      screen.getByRole("button", { name: /confirm & book appointment/i })
    );

    expect(
      await screen.findByRole("heading", { name: "Appointment Confirmed!" })
    ).toBeInTheDocument();
    expect(screen.getByText("booking-123")).toBeInTheDocument();
    const bookingCall = fetchMock.mock.calls.find(
      ([url]) => String(url) === "/api/appointments"
    );
    expect(JSON.parse(String(bookingCall?.[1]?.body))).toMatchObject({
      doctorId: "doctor-1",
      patientType: "MYSELF",
      patientName: "Jamie Guest",
      phoneNumber: "555-0100",
      appointmentStartUTC: slot.startUTC,
      appointmentEndUTC: slot.endUTC,
      paymentMethod: "CASH",
    });
  }, 15_000);

  it("supports adding multiple todos and ignores whitespace-only entries", async () => {
    const TodoApp = (await import("@/app/reactToyProblem/page")).default;
    const user = userEvent.setup();

    render(<TodoApp />);
    const input = screen.getByPlaceholderText("Enter a new todo...");

    await user.type(input, "   ");
    fireEvent.click(screen.getByRole("button", { name: "Add Todo" }));
    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "Call clinic");
    await user.click(screen.getByRole("button", { name: "Add Todo" }));
    expect(screen.getByText("Call clinic")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
