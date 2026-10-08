// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OurDepartments from "@/components/organisms/our-departments";
import OurDoctors from "@/components/organisms/our-doctors";
import PatientTestimonials from "@/components/organisms/patient-testimonials";

describe("presentational organisms", () => {
  it("renders supplied departments and their canonical links", () => {
    render(
      <OurDepartments
        departments={[{ id: "1", title: "Cardiac Care", slug: "cardiology" }]}
      />
    );

    expect(
      screen.getByRole("link", { name: "Cardiac Care" })
    ).toHaveAttribute("href", "/departments/cardiology");
  });

  it("renders an empty state when no doctors are available", () => {
    render(<OurDoctors doctors={[]} />);

    expect(
      screen.getByText("No doctors are currently available.")
    ).toBeInTheDocument();
  });

  it("renders doctor cards when records are available", () => {
    render(
      <OurDoctors
        doctors={[
          {
            id: "doctor-2",
            name: "Dr. Riley",
            specialty: "Neurology",
            rating: 4.7,
            reviewCount: 8,
            imageSrc: null,
          },
        ]}
      />
    );

    expect(screen.getByRole("link", { name: "Dr. Riley" })).toHaveAttribute(
      "href",
      "/doctors/doctor-2"
    );
  });

  it("supports a custom department heading and hides an empty description", () => {
    render(
      <OurDepartments
        heading="Care areas"
        description=""
        departments={[]}
      />
    );

    expect(screen.getByRole("heading", { name: "Care areas" })).toBeInTheDocument();
  });

  it("renders default testimonials when no records are supplied", () => {
    render(<PatientTestimonials />);

    expect(screen.getByRole("heading", { name: /patient testimonials/i })).toBeInTheDocument();
  });
});
