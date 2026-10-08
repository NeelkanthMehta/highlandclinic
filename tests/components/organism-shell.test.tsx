// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Footer from "@/components/organisms/footer";
import Header from "@/components/organisms/header";
import HomeBanner from "@/components/organisms/home-banner";
import CarouselSlider from "@/components/ui/carousel-slider";

const { router } = vi.hoisted(() => ({
  router: { push: vi.fn(), refresh: vi.fn() },
}));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

describe("shared UI shell", () => {
  beforeEach(() => {
    router.push.mockReset();
    router.refresh.mockReset();
    document.documentElement.classList.remove("dark");
  });

  it("renders header navigation, toggles theme, and signs out a session", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: "patient-1", name: "Taylor Patient", role: "PATIENT" },
        }),
      })
      .mockResolvedValueOnce({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    render(<Header />);

    expect(await screen.findByText("Taylor Patient")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book Appointment" })).toHaveAttribute(
      "href",
      "/book-appointment"
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement).toHaveClass("dark");

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/"));
    expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/sign-out", {
      method: "POST",
    });
    expect(router.refresh).toHaveBeenCalledOnce();
  });

  it("renders the contact footer and banner content", () => {
    render(
      <>
        <Footer />
        <HomeBanner
          title="Care close to home"
          subtitle="Personalized medical care"
          imageSrc="/clinic.jpg"
        />
      </>
    );

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "info@highland.med" })).toHaveAttribute(
      "href",
      "mailto:info@highland.med"
    );
    expect(
      screen.getByRole("heading", { name: "Care close to home" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Care close to home" })).toHaveAttribute(
      "src",
      "/clinic.jpg"
    );
  });

  it("scrolls the accessible carousel in the requested direction", () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });

    render(
      <CarouselSlider>
        <span>Slide one</span>
      </CarouselSlider>
    );
    const track = screen.getByRole("region", { name: "Carousel items" });
    Object.defineProperty(track, "clientWidth", { configurable: true, value: 200 });
    Object.defineProperty(track, "scrollLeft", { configurable: true, value: 50 });

    fireEvent.click(screen.getByRole("button", { name: "Scroll right" }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 200, behavior: "smooth" });
  });
});
