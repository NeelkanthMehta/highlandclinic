import { z } from "zod";

/**
 * Zod validation schema for updating patient profile information.
 */
export const patientProfileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number must be at least 7 characters." }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
});

export type PatientProfileUpdateSchema = z.infer<typeof patientProfileUpdateSchema>;
export type PatientProfileUpdateValues = PatientProfileUpdateSchema;

/**
 * Zod validation schema for submitting an appointment review.
 */
export const reviewSchema = z.object({
  appointmentId: z.string().min(1, { message: "Appointment ID is required." }),
  doctorName: z.string().optional(),
  rating: z
    .number({ message: "Rating is required." })
    .min(1, { message: "Please select a rating of at least 1 star." })
    .max(5, { message: "Rating cannot exceed 5 stars." }),
  reviewText: z
    .string()
    .min(5, { message: "Review text must be at least 5 characters long." }),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
export type ReviewFormValues = ReviewSchema;

/**
 * Appointment Status options
 */
export type AppointmentStatus =
  | "Pending"
  | "Upcoming"
  | "Completed"
  | "Cancelled"
  | "No-show";

/**
 * Interface representing a historical appointment
 */
export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  dateTime: string;
  status: AppointmentStatus;
  reasonForVisit?: string;
}

/**
 * Interface representing patient profile payload passed to components
 */
export interface PatientProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  appointments: Appointment[];
}
