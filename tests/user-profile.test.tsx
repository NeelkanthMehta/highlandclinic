// @vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserProfilePage from "@/app/profile/profile-client";
import { EditPatientProfileModal } from "@/components/molecules/user-profile/edit-patient-profile-modal";
import { ReviewDialog } from "@/components/molecules/user-profile/review-dialog";

describe("User Profile Page & Modals", () => {
  const mockPatient = {
    id: "patient-1",
    fullName: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phoneNumber: "+1 (555) 123-4567",
    dateOfBirth: "March 15, 1985",
    address: "123 Healthcare Ave, Medical City, MC 12345",
    appointments: [
      {
        id: "apt-1",
        doctorName: "Dr. James Wilson",
        doctorSpecialty: "Cardiology",
        dateTime: "March 25, 2024 • 10:30 AM",
        status: "Upcoming" as const,
      },
      {
        id: "apt-2",
        doctorName: "Dr. Emily Parker",
        doctorSpecialty: "Dermatology",
        dateTime: "March 15, 2024 • 2:00 PM",
        status: "Completed" as const,
      },
      {
        id: "apt-3",
        doctorName: "Dr. Robert Brown",
        doctorSpecialty: "Orthopedics",
        dateTime: "March 10, 2024 • 11:15 AM",
        status: "Cancelled" as const,
      },
    ],
  };

  it("renders profile header and personal information card details", () => {
    render(<UserProfilePage patient={mockPatient} />);

    expect(screen.getAllByText("Sarah Mitchell")[0]).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("sarah.mitchell@email.com")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("March 15, 1985")).toBeInTheDocument();
    expect(screen.getByText("123 Healthcare Ave, Medical City, MC 12345")).toBeInTheDocument();
  });

  it("renders appointment list with correct status badges and conditional action buttons", () => {
    render(<UserProfilePage patient={mockPatient} />);

    expect(screen.getByText("Dr. James Wilson")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    expect(screen.getByText("Dr. Emily Parker")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Leave Review")).toBeInTheDocument();

    expect(screen.getByText("Dr. Robert Brown")).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("opens edit profile modal and submits updated details", async () => {
    const handleUpdate = vi.fn();
    render(
      <EditPatientProfileModal
        isOpen={true}
        onClose={vi.fn()}
        patientData={mockPatient}
        onSubmit={handleUpdate}
      />
    );

    expect(screen.getByText("Edit Personal Information")).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/Full Name/i);
    expect(nameInput).toHaveValue("Sarah Mitchell");

    fireEvent.change(nameInput, { target: { value: "Sarah Connor" } });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "Sarah Connor",
        })
      );
    });
  });

  it("opens review dialog and submits rating with Controller binding", async () => {
    const handleReviewSubmit = vi.fn();
    const appointmentToReview = mockPatient.appointments[1];

    render(
      <ReviewDialog
        isOpen={true}
        onClose={vi.fn()}
        appointment={appointmentToReview}
        onSubmit={handleReviewSubmit}
      />
    );

    expect(screen.getByText("Leave a Review")).toBeInTheDocument();
    expect(screen.getAllByText(/Dr. Emily Parker/i)[0]).toBeInTheDocument();

    // Select 4-star rating button
    const starButton = screen.getByLabelText("Rate 4 out of 5 stars");
    fireEvent.click(starButton);

    const feedbackInput = screen.getByPlaceholderText(/Tell us about your consultation/i);
    fireEvent.change(feedbackInput, { target: { value: "Great consultation!" } });

    fireEvent.click(screen.getByRole("button", { name: /Submit Review/i }));

    await waitFor(() => {
      expect(handleReviewSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentId: "apt-2",
          rating: 4,
          reviewText: "Great consultation!",
        })
      );
    });
  });
});
