// @vitest-environment jsdom

import { fireEvent, render, screen, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import SessionTimeoutProvider, {
  INACTIVITY_TIMEOUT_MS,
  WARNING_BEFORE_TIMEOUT_MS,
  STORAGE_ACTIVITY_KEY,
} from "@/components/auth/session-timeout-provider";

const { router } = vi.hoisted(() => ({
  router: { push: vi.fn(), refresh: vi.fn() },
}));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

describe("SessionTimeoutProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    router.push.mockReset();
    router.refresh.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("remains idle when natural state is signed out (user is null)", () => {
    render(
      <SessionTimeoutProvider user={null}>
        <div>App Content</div>
      </SessionTimeoutProvider>
    );

    expect(screen.getByText("App Content")).toBeInTheDocument();
    expect(screen.queryByText(/Session Inactivity Warning/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Session Expired/i)).not.toBeInTheDocument();

    // Fast forward 35 minutes
    act(() => {
      vi.advanceTimersByTime(35 * 60 * 1000);
    });

    expect(screen.queryByText(/Session Inactivity Warning/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Session Expired/i)).not.toBeInTheDocument();
  });

  it("shows warning modal when inactive for 28 minutes", async () => {
    const mockUser = {
      id: "patient-1",
      name: "Test Patient",
      email: "test@example.com",
      role: "PATIENT",
    };

    render(
      <SessionTimeoutProvider user={mockUser}>
        <div>App Content</div>
      </SessionTimeoutProvider>
    );

    expect(screen.getByText("App Content")).toBeInTheDocument();

    // Fast forward 28.5 minutes (past warning threshold of 28m)
    act(() => {
      vi.advanceTimersByTime(28.5 * 60 * 1000);
    });

    expect(screen.getByText(/Session Inactivity Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Stay Signed In/i)).toBeInTheDocument();
  });

  it("resets inactivity timer when user clicks Stay Signed In", async () => {
    const mockUser = {
      id: "patient-1",
      name: "Test Patient",
      email: "test@example.com",
      role: "PATIENT",
    };

    render(
      <SessionTimeoutProvider user={mockUser}>
        <div>App Content</div>
      </SessionTimeoutProvider>
    );

    // Fast forward to warning
    act(() => {
      vi.advanceTimersByTime(28.5 * 60 * 1000);
    });

    expect(screen.getByText(/Session Inactivity Warning/i)).toBeInTheDocument();

    // Click "Stay Signed In"
    fireEvent.click(screen.getByText(/Stay Signed In/i));

    expect(screen.queryByText(/Session Inactivity Warning/i)).not.toBeInTheDocument();
  });

  it("signs out and shows expired dialog when inactive for 30 minutes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const mockUser = {
      id: "patient-1",
      name: "Test Patient",
      email: "test@example.com",
      role: "PATIENT",
    };

    render(
      <SessionTimeoutProvider user={mockUser}>
        <div>App Content</div>
      </SessionTimeoutProvider>
    );

    // Fast forward full 30 minutes
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });

    expect(screen.getByText(/Session Expired/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", {
      method: "POST",
    });
  });
});

