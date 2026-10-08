// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DepartmentCard from "@/components/molecules/departmentcard";
import DoctorCard from "@/components/molecules/doctorcard";
import Review from "@/components/molecules/review";
import { fireEvent } from "@testing-library/react";

describe("presentational molecules", () => {
  it("links a department card to its supplied destination", () => {
    render(<DepartmentCard title="Neurology" href="/departments/neurology" />);

    expect(screen.getByRole("link", { name: "Neurology" })).toHaveAttribute(
      "href",
      "/departments/neurology"
    );
  });

  it("renders a doctor profile link and initials when no image is available", () => {
    render(
      <DoctorCard
        id="doctor-1"
        name="Dr. Sarah Jenkins"
        specialty="Cardiology"
        rating={4.9}
        reviewCount={14}
        imageSrc={null}
      />
    );

    expect(screen.getByRole("link", { name: "Dr. Sarah Jenkins" })).toHaveAttribute(
      "href",
      "/doctors/doctor-1"
    );
    expect(screen.getByText("SJ")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("4.9 (14 reviews)")).toBeInTheDocument();
  });

  it("renders reviewer content and quotes an unquoted comment", () => {
    render(<Review name="Avery Patient" comment="Kind and attentive care." />);

    expect(screen.getByRole("heading", { name: "Avery Patient" })).toBeInTheDocument();
    expect(screen.getByText('"Kind and attentive care."')).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Avery Patient" })).toBeInTheDocument();
  });

  it("supports a React icon and click callback without a department link", () => {
    const onClick = vi.fn();
    render(
      <DepartmentCard
        title="Neurology"
        icon={<span>Brain icon</span>}
        onClick={onClick}
      />
    );

    fireEvent.click(screen.getByText("Neurology").closest("[data-slot='card']")!);
    expect(screen.getByText("Brain icon")).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("offers a profile button when no doctor link is available", () => {
    const onViewProfile = vi.fn();
    render(
      <DoctorCard
        name="Taylor Doctor"
        specialty="Neurology"
        rating={0}
        reviewCount={0}
        imageSrc="https://example.test/doctor.png"
        onViewProfile={onViewProfile}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "View Profile" }));
    expect(onViewProfile).toHaveBeenCalledOnce();
    expect(screen.getByRole("img", { name: "Taylor Doctor" })).toHaveAttribute(
      "src",
      "https://example.test/doctor.png"
    );
  });

  it("keeps an already quoted review unchanged", () => {
    render(<Review comment='"Excellent care."' />);
    expect(screen.getByText('"Excellent care."')).toBeInTheDocument();
  });
});
