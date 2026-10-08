import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, getSessionUser } = vi.hoisted(() => ({
  prisma: {
    user: { findFirst: vi.fn() },
    appointment: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/auth", () => ({ getSessionUser }));

import {
  GET as listAppointments,
  POST as createAppointment,
} from "@/app/api/appointments/route";
import { GET as getAppointment } from "@/app/api/appointments/[id]/route";

const patient = {
  id: "patient-1",
  email: "patient@example.com",
  name: "Pat Patient",
  role: "PATIENT" as const,
};

const appointment = {
  appointmentId: "appointment-1",
  userId: patient.id,
  doctorId: "doctor-1",
};

function request(url: string, body?: unknown): NextRequest {
  return new NextRequest(url, {
    method: body === undefined ? "GET" : "POST",
    ...(body === undefined
      ? {}
      : {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
}

describe("appointment API", () => {
  beforeEach(() => {
    getSessionUser.mockReset();
    prisma.user.findFirst.mockReset();
    prisma.appointment.findFirst.mockReset();
    prisma.appointment.findMany.mockReset();
    prisma.appointment.findUnique.mockReset();
    prisma.appointment.create.mockReset();
  });

  it("continues to allow guest bookings and confirms them in the POST response", async () => {
    prisma.user.findFirst.mockResolvedValue({ id: "doctor-1", role: "DOCTOR" });
    prisma.appointment.findFirst.mockResolvedValue(null);
    prisma.appointment.create.mockResolvedValue(appointment);

    const response = await createAppointment(
      request("http://localhost/api/appointments", {
        doctorId: "doctor-1",
        patientName: "Pat Patient",
        phoneNumber: "555-0100",
        appointmentStartUTC: "2026-10-08T10:00:00.000Z",
        appointmentEndUTC: "2026-10-08T10:30:00.000Z",
      })
    );

    expect(response.status).toBe(201);
    expect((await response.json()).appointment).toEqual(appointment);
    expect(getSessionUser).toHaveBeenCalledOnce();
    expect(prisma.appointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: null }),
      })
    );
  });

  it("associates a signed-in patient with their new appointment", async () => {
    getSessionUser.mockResolvedValue(patient);
    prisma.user.findFirst.mockResolvedValue({ id: "doctor-1", role: "DOCTOR" });
    prisma.appointment.findFirst.mockResolvedValue(null);
    prisma.appointment.create.mockResolvedValue(appointment);

    const response = await createAppointment(
      request("http://localhost/api/appointments", {
        doctorId: "doctor-1",
        patientName: "Pat Patient",
        phoneNumber: "555-0100",
        appointmentStartUTC: "2026-10-08T10:00:00.000Z",
        appointmentEndUTC: "2026-10-08T10:30:00.000Z",
        paymentMethod: "ONLINE",
      })
    );

    expect(response.status).toBe(201);
    expect(prisma.appointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: patient.id,
          status: "PAYMENT_PENDING",
        }),
      })
    );
  });

  it("rejects malformed bodies and unsupported payment methods as client errors", async () => {
    const malformed = await createAppointment(
      new NextRequest("http://localhost/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      })
    );
    expect(malformed.status).toBe(400);

    const invalidEnum = await createAppointment(
      request("http://localhost/api/appointments", {
        doctorId: "doctor-1",
        patientName: "Pat Patient",
        phoneNumber: "555-0100",
        appointmentStartUTC: "2026-10-08T10:00:00.000Z",
        appointmentEndUTC: "2026-10-08T10:30:00.000Z",
        paymentMethod: "WIRE",
      })
    );
    expect(invalidEnum.status).toBe(400);
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });

  it("rejects invalid dates, reversed times, missing doctors, and overlapping bookings", async () => {
    prisma.user.findFirst.mockResolvedValue({ id: "doctor-1", role: "DOCTOR" });

    const validBody = {
      doctorId: "doctor-1",
      patientName: "Pat Patient",
      phoneNumber: "555-0100",
      appointmentStartUTC: "2026-10-08T10:00:00.000Z",
      appointmentEndUTC: "2026-10-08T10:30:00.000Z",
    };

    const invalidDate = await createAppointment(
      request("http://localhost/api/appointments", {
        ...validBody,
        appointmentStartUTC: "not-a-date",
      })
    );
    expect(invalidDate.status).toBe(400);

    const reversed = await createAppointment(
      request("http://localhost/api/appointments", {
        ...validBody,
        appointmentStartUTC: "2026-10-08T11:00:00.000Z",
      })
    );
    expect(reversed.status).toBe(400);

    prisma.user.findFirst.mockResolvedValue(null);
    const missingDoctor = await createAppointment(
      request("http://localhost/api/appointments", validBody)
    );
    expect(missingDoctor.status).toBe(404);

    prisma.user.findFirst.mockResolvedValue({ id: "doctor-1", role: "DOCTOR" });
    prisma.appointment.findFirst.mockResolvedValue({ appointmentId: "existing" });
    const conflict = await createAppointment(
      request("http://localhost/api/appointments", validBody)
    );
    expect(conflict.status).toBe(409);
    expect(prisma.appointment.findFirst).toHaveBeenCalledWith({
      where: {
        doctorId: "doctor-1",
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        appointmentStartUTC: { lt: new Date(validBody.appointmentEndUTC) },
        appointmentEndUTC: { gt: new Date(validBody.appointmentStartUTC) },
      },
    });
  });

  it("rejects malformed optional fields and reports persistence failures", async () => {
    const validBody = {
      doctorId: "doctor-1",
      patientName: "Pat Patient",
      phoneNumber: "555-0100",
      appointmentStartUTC: "2026-10-08T10:00:00.000Z",
      appointmentEndUTC: "2026-10-08T10:30:00.000Z",
    };
    const badOptionalFields = await createAppointment(
      request("http://localhost/api/appointments", {
        ...validBody,
        patientdateofbirth: "not-a-date",
      })
    );
    expect(badOptionalFields.status).toBe(400);

    prisma.user.findFirst.mockResolvedValue({ id: "doctor-1", role: "DOCTOR" });
    prisma.appointment.findFirst.mockResolvedValue(null);
    prisma.appointment.create.mockRejectedValue(new Error("write failed"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const failed = await createAppointment(
      request("http://localhost/api/appointments", validBody)
    );
    expect(failed.status).toBe(500);
  });

  it("requires a session before listing appointments", async () => {
    getSessionUser.mockResolvedValue(null);

    const response = await listAppointments(
      request("http://localhost/api/appointments")
    );

    expect(response.status).toBe(401);
    expect(prisma.appointment.findMany).not.toHaveBeenCalled();
  });

  it("rejects unsupported session roles", async () => {
    getSessionUser.mockResolvedValue({ ...patient, role: "UNKNOWN" });

    const response = await listAppointments(
      request("http://localhost/api/appointments")
    );

    expect(response.status).toBe(403);
    expect(prisma.appointment.findMany).not.toHaveBeenCalled();
  });

  it("returns a server error when appointment listing fails", async () => {
    getSessionUser.mockResolvedValue({ ...patient, role: "ADMIN" });
    prisma.appointment.findMany.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await listAppointments(
      request("http://localhost/api/appointments")
    );

    expect(response.status).toBe(500);
  });

  it.each([
    [patient, { userId: patient.id }],
    [{ ...patient, id: "doctor-2", role: "DOCTOR" }, { doctorId: "doctor-2" }],
    [{ ...patient, id: "admin-1", role: "ADMIN" }, undefined],
  ])("limits list access for role %s", async (session, expectedWhere) => {
    getSessionUser.mockResolvedValue(session);
    prisma.appointment.findMany.mockResolvedValue([]);

    const response = await listAppointments(
      request("http://localhost/api/appointments")
    );

    expect(response.status).toBe(200);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere })
    );
  });

  it("returns only the requested patient's records when filtering by doctor", async () => {
    getSessionUser.mockResolvedValue(patient);
    prisma.appointment.findMany.mockResolvedValue([]);

    await listAppointments(
      request("http://localhost/api/appointments?doctorId=doctor-1")
    );

    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: patient.id, doctorId: "doctor-1" },
      })
    );
  });

  it("limits doctor reads to their own appointments regardless of query filter", async () => {
    getSessionUser.mockResolvedValue({ ...patient, id: "doctor-1", role: "DOCTOR" });
    prisma.appointment.findMany.mockResolvedValue([]);

    const response = await listAppointments(
      request("http://localhost/api/appointments?doctorId=doctor-2")
    );

    expect(response.status).toBe(200);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { doctorId: "doctor-1" } })
    );
  });

  it("allows admins to filter the clinic-wide list by doctor", async () => {
    getSessionUser.mockResolvedValue({ ...patient, id: "admin-1", role: "ADMIN" });
    prisma.appointment.findMany.mockResolvedValue([]);

    await listAppointments(
      request("http://localhost/api/appointments?doctorId=doctor-1")
    );

    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { doctorId: "doctor-1" } })
    );
  });

  it("does not disclose another patient's appointment", async () => {
    getSessionUser.mockResolvedValue(patient);
    prisma.appointment.findUnique.mockResolvedValue({
      ...appointment,
      userId: "someone-else",
    });

    const response = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Appointment not found" });
  });

  it("returns 401, 404, and 500 for unauthorized, missing, and failed detail reads", async () => {
    getSessionUser.mockResolvedValue(null);
    const anonymous = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(anonymous.status).toBe(401);
    expect(prisma.appointment.findUnique).not.toHaveBeenCalled();

    getSessionUser.mockResolvedValue(patient);
    prisma.appointment.findUnique.mockResolvedValue(null);
    const missing = await getAppointment(
      request("http://localhost/api/appointments/missing"),
      { params: Promise.resolve({ id: "missing" }) }
    );
    expect(missing.status).toBe(404);

    prisma.appointment.findUnique.mockRejectedValue(new Error("database unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failed = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(failed.status).toBe(500);
  });

  it("allows a patient to read their own appointment and an admin to read any", async () => {
    getSessionUser.mockResolvedValue(patient);
    prisma.appointment.findUnique.mockResolvedValue(appointment);
    const own = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(own.status).toBe(200);

    getSessionUser.mockResolvedValue({ ...patient, id: "admin-1", role: "ADMIN" });
    const admin = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(admin.status).toBe(200);
  });

  it("allows only the assigned doctor to read the appointment", async () => {
    prisma.appointment.findUnique.mockResolvedValue(appointment);
    getSessionUser.mockResolvedValue({
      ...patient,
      id: "another-doctor",
      role: "DOCTOR",
    });
    const denied = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(denied.status).toBe(404);

    getSessionUser.mockResolvedValue({
      ...patient,
      id: appointment.doctorId,
      role: "DOCTOR",
    });
    const allowed = await getAppointment(
      request("http://localhost/api/appointments/appointment-1"),
      { params: Promise.resolve({ id: "appointment-1" }) }
    );
    expect(allowed.status).toBe(200);
  });
});
