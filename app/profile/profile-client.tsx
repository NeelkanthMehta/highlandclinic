"use client";

import { useState } from "react";
import {
  PatientProfile,
  Appointment,
  PatientProfileUpdateValues,
  ReviewFormValues,
} from "@/schemas/user-profile";
import EditPatientProfileModal from "@/components/molecules/user-profile/edit-patient-profile-modal";
import ReviewDialog from "@/components/molecules/user-profile/review-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

/**
 * Calculates user initials dynamically from full name.
 */
function getInitials(name?: string | null): string {
  if (!name || name === "NO_NAME") return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface ProfilePageProps {
  patient: PatientProfile;
}

export default function UserProfilePage({ patient }: ProfilePageProps) {
  // Dynamic patient state
  const [patientData, setPatientData] = useState<PatientProfile>(patient);

  // Modal State handling
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<Appointment | null>(null);

  // Success Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination State (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(patientData.appointments.length / pageSize);

  const displayedAppointments = patientData.appointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // Profile Edit Handler
  const handleUpdateProfile = (updatedValues: PatientProfileUpdateValues) => {
    setPatientData((prev) => ({
      ...prev,
      fullName: updatedValues.fullName,
      email: updatedValues.email,
      phoneNumber: updatedValues.phoneNumber,
      dateOfBirth: updatedValues.dateOfBirth,
      address: updatedValues.address,
    }));
    triggerNotification("Profile details updated successfully!");
  };

  // Appointment Cancel Handler
  const handleCancelAppointment = (appointmentId: string) => {
    setPatientData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "Cancelled" as const } : apt
      ),
    }));
    triggerNotification("Appointment cancelled successfully.");
  };

  // Review Submit Handler
  const handleReviewSubmit = (reviewData: ReviewFormValues) => {
    triggerNotification(
      `Thank you for your ${reviewData.rating}-star review for appointment!`
    );
  };

  const handleOpenReviewModal = (appointment: Appointment) => {
    setSelectedAppointmentForReview(appointment);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Toast / Notification Alert */}
        {notification && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium">{notification}</p>
          </div>
        )}

        {/* 1. Profile Header */}
        <div className="flex items-center gap-4 bg-transparent py-2">
          {patientData.avatarUrl ? (
            <img
              src={patientData.avatarUrl}
              alt={patientData.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm border-2 border-white dark:border-slate-800"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {getInitials(patientData.fullName)}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {patientData.fullName}
            </h1>
          </div>
        </div>

        {/* 2. Personal Information Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Personal Information
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800 font-medium gap-1.5"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {/* Full Name */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Full Name
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {patientData.fullName}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 break-all">
                {patientData.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Phone
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              {patientData.phoneNumber || "Not provided"}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Address
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {patientData.address || "Not provided"}
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Date of Birth
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {patientData.dateOfBirth || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Appointments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white px-1">
            Appointments
          </h2>

          <div className="space-y-3">
            {displayedAppointments.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                You don&apos;t have any appointments yet.
              </div>
            ) : displayedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {apt.dateTime}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Status Badge */}
                  <Badge
                    variant={
                      apt.status === "Upcoming"
                        ? "upcoming"
                        : apt.status === "Pending"
                        ? "pending"
                        : apt.status === "Completed"
                        ? "completed"
                        : apt.status === "No-show"
                        ? "no-show"
                        : "cancelled"
                    }
                    className="px-3 py-1 font-semibold text-xs rounded-md"
                  >
                    {apt.status}
                  </Badge>

                  {/* Conditional Action Buttons */}
                  {apt.status === "Upcoming" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 text-xs px-3 h-8 font-medium"
                    >
                      Cancel
                    </Button>
                  )}

                  {apt.status === "Completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReviewModal(apt)}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/40 text-xs px-3 h-8 font-medium gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" /> Leave Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-slate-600 dark:text-slate-300 text-xs font-medium gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-slate-600 dark:text-slate-300 text-xs font-medium gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditPatientProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientData={{
          fullName: patientData.fullName,
          email: patientData.email,
          phoneNumber: patientData.phoneNumber,
          dateOfBirth: patientData.dateOfBirth,
          address: patientData.address,
        }}
        onSubmit={handleUpdateProfile}
      />

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        appointment={selectedAppointmentForReview}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
