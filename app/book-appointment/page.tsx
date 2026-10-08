"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  Phone,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Star,
  FileText,
  CreditCard,
  Building,
  Printer,
  ChevronRight,
} from "lucide-react";

interface DoctorProfile {
  profileId: string;
  specialty: string;
  brief: string;
  credentials: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  specializations: string[];
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  address: string | null;
  doctorProfile: DoctorProfile | null;
}

interface TimeSlot {
  time: string;
  startUTC: string;
  endUTC: string;
  isAvailable: boolean;
  reason?: string;
}

interface ConfirmedAppointment {
  appointmentId: string;
  patientName: string;
  patientType: string;
  phoneNumber: string | null;
  appointmentStartUTC: string;
  appointmentEndUTC: string;
  paymentMethod: string | null;
  status: string;
  reasonForVisit: string | null;
  doctor: {
    id: string;
    name: string;
    image: string | null;
    doctorProfile: {
      specialty: string;
    } | null;
  };
}

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDoctorId = searchParams.get("doctorId") || "";

  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");

  // Selection states
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId);
  
  // Default date to today's YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());

  // Slot states
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotMessage, setSlotMessage] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form states
  const [patientType, setPatientType] = useState<"MYSELF" | "SOMEONE_ELSE">("MYSELF");
  const [patientRelation, setPatientRelation] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [patientdateofbirth, setPatientdateofbirth] = useState<string>("");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE">("CASH");

  // Workflow states
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<ConfirmedAppointment | null>(null);

  // Fetch doctors on mount
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoadingDoctors(true);
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("Failed to load doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
        
        // If initialDoctorId was provided and valid, keep it
        if (initialDoctorId && data.doctors.some((d: Doctor) => d.id === initialDoctorId)) {
          setSelectedDoctorId(initialDoctorId);
        } else if (data.doctors.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(data.doctors[0].id);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load doctors. Please refresh the page.");
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, [initialDoctorId]);

  // Fetch slots whenever selected doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;

    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        setSelectedSlot(null);
        setSlotMessage("");
        
        const res = await fetch(`/api/doctors/${selectedDoctorId}/slots?date=${selectedDate}`);
        const data = await res.json();

        if (!res.ok) {
          setSlots([]);
          setSlotMessage(data.error || "Could not retrieve available slots.");
          return;
        }

        setSlots(data.slots || []);
        setSlotMessage(data.message || "");
      } catch (err) {
        console.error(err);
        setSlots([]);
        setSlotMessage("Error loading time slots.");
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedDoctorId, selectedDate]);

  // Get active doctor details
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Extract unique specialties for filtering
  const specialties = Array.from(
    new Set(doctors.map((d) => d.doctorProfile?.specialty).filter(Boolean))
  ) as string[];

  const filteredDoctors = doctors.filter((d) => {
    if (selectedSpecialty === "ALL") return true;
    return d.doctorProfile?.specialty === selectedSpecialty;
  });

  // Handle Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedDoctorId) {
      setErrorMessage("Please select a doctor.");
      return;
    }
    if (!selectedSlot) {
      setErrorMessage("Please select an available time slot.");
      return;
    }
    if (!patientName.trim()) {
      setErrorMessage("Please enter the patient's full name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Please enter a contact phone number.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        doctorId: selectedDoctorId,
        patientType,
        patientRelation: patientType === "SOMEONE_ELSE" ? patientRelation : null,
        patientName,
        phoneNumber,
        reasonForVisit,
        additionalNotes,
        patientdateofbirth: patientdateofbirth || null,
        appointmentStartUTC: selectedSlot.startUTC,
        appointmentEndUTC: selectedSlot.endUTC,
        paymentMethod,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to book appointment.");
        return;
      }

      setConfirmedAppointment(data.appointment);
      setStep(4); // Confirmation step
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while submitting your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format UTC string to local readable time (e.g., "10:30 AM")
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return isoString;
    }
  };

  // Format date to readable string (e.g., "Thursday, October 15, 2026")
  const formatDateReadable = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(Date.UTC(year, month - 1, day));
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  if (loadingDoctors) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Loading Highland Clinic appointment system...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Book a Consultation
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Select your preferred specialist, choose a convenient time slot, and confirm your visit.
              </p>
            </div>
            {confirmedAppointment && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0 self-start md:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Booking Verified
              </span>
            )}
          </div>
        </div>

        {/* Step Indicator Progress Bar (Steps 1 to 3) */}
        {!confirmedAppointment && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-semibold">
              <div
                onClick={() => setStep(1)}
                className={`py-2 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 ${
                  step === 1
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : step > 1
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${step > 1 ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700" : "bg-blue-600 text-white"}`}>
                  {step > 1 ? "✓" : "1"}
                </span>
                <span className="hidden sm:inline">Select Doctor</span>
                <span className="sm:hidden">Doctor</span>
              </div>

              <div
                onClick={() => selectedDoctorId && setStep(2)}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  !selectedDoctorId ? "opacity-50 cursor-not-allowed text-slate-400" : "cursor-pointer"
                } ${
                  step === 2
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : step > 2
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${step > 2 ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700" : step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                  {step > 2 ? "✓" : "2"}
                </span>
                <span className="hidden sm:inline">Date & Time</span>
                <span className="sm:hidden">Slot</span>
              </div>

              <div
                onClick={() => selectedSlot && setStep(3)}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  !selectedSlot ? "opacity-50 cursor-not-allowed text-slate-400" : "cursor-pointer"
                } ${
                  step === 3
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${step === 3 ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                  3
                </span>
                <span className="hidden sm:inline">Patient Info</span>
                <span className="sm:hidden">Details</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: SELECT DOCTOR */}
        {step === 1 && !confirmedAppointment && (
          <div className="space-y-6">
            {/* Specialty Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedSpecialty("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSpecialty === "ALL"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All Specialties ({doctors.length})
              </button>
              {specialties.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSpecialty === spec
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                    }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? "border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                        : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {doc.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xl shrink-0">
                          {doc.name.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                            {doc.name}
                          </h3>
                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {doc.doctorProfile?.specialty || "Medical Specialist"}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {doc.doctorProfile?.credentials}
                        </p>

                        {doc.doctorProfile?.rating ? (
                          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold pt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{doc.doctorProfile.rating.toFixed(1)}</span>
                            <span className="text-slate-400 font-normal">
                              ({doc.doctorProfile.reviewCount} reviews)
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      &ldquo;{doc.doctorProfile?.brief}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{doc.address || "Highland Main Clinic"}</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        Select Doctor <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button Step 1 */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!selectedDoctorId}
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                Proceed to Schedule <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT SELECTION */}
        {step === 2 && !confirmedAppointment && (
          <div className="space-y-6">
            {/* Selected Doctor Summary Card */}
            {selectedDoctor && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {selectedDoctor.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                      {selectedDoctor.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {selectedDoctor.doctorProfile?.specialty}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
                >
                  Change Doctor
                </button>
              </div>
            )}

            {/* Date & Slot Picker Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
              
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-500" />
                  Select Date
                </label>
                <input
                  type="date"
                  min={getTodayStr()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing slots for: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDateReadable(selectedDate)}</span>
                </p>
              </div>

              {/* Time Slots Area */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Available Time Slots
                </label>

                {loadingSlots ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <span>Calculating doctor availability...</span>
                  </div>
                ) : slotMessage && slots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    {slotMessage}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {slots.map((slot, idx) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30"
                              : slot.isAvailable
                              ? "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50"
                              : "bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800/60 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <span className="text-sm font-semibold">{formatTime(slot.startUTC)}</span>
                          <span className="text-[10px] font-normal opacity-80">
                            {slot.isAvailable ? "Available" : slot.reason || "Booked"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Back / Next Buttons Step 2 */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                Continue to Patient Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT DETAILS & CONFIRMATION FORM */}
        {step === 3 && !confirmedAppointment && (
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Summary Box */}
            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-2xl p-5 border border-blue-200 dark:border-blue-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Selected Consultation Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Doctor</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDoctor?.name}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 block">{selectedDoctor?.doctorProfile?.specialty}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Date & Time</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatDateReadable(selectedDate)}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                    {selectedSlot ? formatTime(selectedSlot.startUTC) : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Patient Form Fields Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Patient Information
              </h3>

              {/* Patient Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Who is this appointment for?
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="patientType"
                      value="MYSELF"
                      checked={patientType === "MYSELF"}
                      onChange={() => setPatientType("MYSELF")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    Myself
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="patientType"
                      value="SOMEONE_ELSE"
                      checked={patientType === "SOMEONE_ELSE"}
                      onChange={() => setPatientType("SOMEONE_ELSE")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    Someone Else (Family / Dependent)
                  </label>
                </div>
              </div>

              {/* Patient Relation (if someone else) */}
              {patientType === "SOMEONE_ELSE" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Relation to Patient (e.g. Spouse, Child, Parent)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Son, Daughter, Mother"
                    value={patientRelation}
                    onChange={(e) => setPatientRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Patient Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 000-1234"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date of Birth & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={patientdateofbirth}
                    onChange={(e) => setPatientdateofbirth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Reason for Visit (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Checkup, Chest Pain, Routine Consultation"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Additional Medical Notes or Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any existing symptoms, medical history, or insurance query..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-500" /> Payment Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod("CASH")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMethod === "CASH"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={paymentMethod === "CASH"}
                      onChange={() => setPaymentMethod("CASH")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold">Pay at Clinic</div>
                      <div className="text-[11px] text-slate-500">Pay cash or card upon arrival</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMethod === "ONLINE"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-slate-900 dark:text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={() => setPaymentMethod("ONLINE")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold">Online Payment</div>
                      <div className="text-[11px] text-slate-500">Reserve slot & pay online</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Back & Submit Buttons Step 3 */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CONFIRMATION RECEIPT VIEW */}
        {step === 4 && confirmedAppointment && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 max-w-2xl mx-auto">
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Appointment Confirmed!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Your consultation has been registered in Highland Medical Center database.
              </p>
            </div>

            {/* Reference Number Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">
                Booking Reference ID
              </span>
              <div className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 select-all">
                {confirmedAppointment.appointmentId}
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Physician</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {confirmedAppointment.doctor?.name} ({confirmedAppointment.doctor?.doctorProfile?.specialty})
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Patient Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {confirmedAppointment.patientName}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white text-right">
                  {confirmedAppointment.phoneNumber}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Date</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {new Date(confirmedAppointment.appointmentStartUTC).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Time Slot</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-right">
                  {formatTime(confirmedAppointment.appointmentStartUTC)} - {formatTime(confirmedAppointment.appointmentEndUTC)}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Payment Method</span>
                <span className="font-semibold text-slate-900 dark:text-white text-right">
                  {confirmedAppointment.paymentMethod === "CASH" ? "Pay at Clinic (Cash / Card)" : "Online Payment"}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {confirmedAppointment.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Confirmation
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  setStep(1);
                  setSelectedSlot(null);
                }}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <BookAppointmentContent />
    </Suspense>
  );
}

