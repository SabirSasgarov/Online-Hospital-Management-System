/**
 * Maps HMS.API DTOs (src/types/api.ts) into the UI-friendly shapes the pages
 * were originally built against (src/types/index.ts). Keeping this mapping in
 * one place means pages barely change when swapping mock arrays for real
 * queries — they just consume the same `Patient`, `Doctor`, `Appointment`, etc.
 * shapes as before.
 */
import type {
  Appointment, AuditLog, Bed, DischargeSummary, Doctor, DoctorSchedule, LabResult, Message, Patient,
  Prescription, Room, Visit, Ward,
} from '@/types'
import type {
  AppointmentDto, AppointmentSummaryDto, AuditLogDto, BedDto, BedInRoomDto, DischargeSummaryDto, DoctorDto,
  DoctorScheduleDto, DoctorSummaryDto, LabResultDto, MessageDto, PatientDto, PatientSummaryDto,
  PrescriptionDto, RoomDto, VisitDto, WardDto, WardSummaryDto,
} from '@/types/api'

// ── small helpers ──────────────────────────────────────────────────────────

/** "Hypertension,Diabetes Type 2" -> ["Hypertension", "Diabetes Type 2"] */
export function splitCsv(value: string | undefined | null): string[] {
  if (!value) return []
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}

/** ["Hypertension", "Diabetes Type 2"] -> "Hypertension,Diabetes Type 2" */
export function joinCsv(values: string[]): string {
  return values.map((v) => v.trim()).filter(Boolean).join(',')
}

/** ISO datetime -> "YYYY-MM-DD" for <input type="date"> */
export function toDateInput(iso: string | undefined | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

/** ISO datetime -> "HH:mm" for <input type="time"> */
export function toTimeInput(iso: string | undefined | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toTimeString().slice(0, 5)
}

/** "YYYY-MM-DD" + "HH:mm" -> ISO datetime string (local time). */
export function combineDateTime(date: string, time: string): string {
  if (!date) return new Date().toISOString()
  return new Date(`${date}T${time || '00:00'}:00`).toISOString()
}

export const apiTypeToUi: Record<string, Appointment['type']> = {
  Consultation: 'consultation',
  FollowUp: 'follow-up',
  Emergency: 'emergency',
  Checkup: 'checkup',
}

export const apiAppointmentStatusToUi: Record<string, Appointment['status']> = {
  Scheduled: 'scheduled',
  Completed: 'completed',
  Cancelled: 'cancelled',
  NoShow: 'no-show',
}

const apiGenderToUi: Record<string, Patient['gender']> = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
}

const apiRoomTypeToUi: Record<string, Room['type']> = {
  Single: 'single',
  Double: 'double',
  ICU: 'icu',
  General: 'general',
}

const apiBedStatusToUi: Record<string, Bed['status']> = {
  Available: 'available',
  Occupied: 'occupied',
  Maintenance: 'maintenance',
}

const apiLabStatusToUi: Record<string, LabResult['status']> = {
  Normal: 'normal',
  Abnormal: 'abnormal',
  Critical: 'critical',
}

const apiPrescriptionStatusToUi: Record<string, Prescription['status']> = {
  Active: 'active',
  Completed: 'completed',
  Cancelled: 'cancelled',
}

// ── Patients ────────────────────────────────────────────────────────────

export function mapPatientSummary(dto: PatientSummaryDto): Patient {
  return {
    id: dto.id,
    userId: dto.userId,
    name: dto.fullName,
    dateOfBirth: dto.dateOfBirth,
    gender: apiGenderToUi[dto.gender] ?? 'other',
    bloodType: dto.bloodType,
    phone: dto.phone,
    email: dto.email,
    address: '',
    emergencyContact: '',
    conditions: splitCsv(dto.conditions),
    allergies: [],
    registeredAt: dto.createdAt,
    status: dto.isActive ? 'active' : 'discharged',
  }
}

export function mapPatientFull(dto: PatientDto): Patient {
  return {
    ...mapPatientSummary(dto),
    address: dto.address,
    emergencyContact: [dto.emergencyContactName, dto.emergencyContactPhone].filter(Boolean).join(' '),
    allergies: splitCsv(dto.allergies),
    status: dto.currentBedId ? 'admitted' : dto.isActive ? 'active' : 'discharged',
  }
}

// ── Doctors ─────────────────────────────────────────────────────────────

function mapScheduleDay(day: string): DoctorSchedule {
  return { day, startTime: '', endTime: '' }
}

function mapScheduleDto(dto: DoctorScheduleDto): DoctorSchedule {
  return { day: dto.day, startTime: dto.startTime.slice(0, 5), endTime: dto.endTime.slice(0, 5) }
}

export function mapDoctorSummary(dto: DoctorSummaryDto): Doctor {
  return {
    id: dto.id,
    userId: dto.userId,
    name: `Dr. ${dto.fullName}`,
    specialization: dto.specialization,
    email: dto.email,
    phone: dto.phone,
    schedule: dto.scheduleDays.map(mapScheduleDay),
    available: dto.isAvailable,
    // The API has no doctor-rating concept — kept for the existing card UI, not backend-sourced.
    rating: 4.8,
  }
}

export function mapDoctorFull(dto: DoctorDto): Doctor {
  return {
    ...mapDoctorSummary(dto),
    schedule: dto.schedules.length > 0 ? dto.schedules.map(mapScheduleDto) : dto.scheduleDays.map(mapScheduleDay),
  }
}

// ── Appointments ────────────────────────────────────────────────────────

export function mapAppointment(dto: AppointmentSummaryDto | AppointmentDto): Appointment {
  return {
    id: dto.id,
    patientId: dto.patientId,
    patientName: dto.patientName,
    doctorId: dto.doctorId,
    doctorName: dto.doctorName,
    date: toDateInput(dto.scheduledAt),
    time: toTimeInput(dto.scheduledAt),
    type: apiTypeToUi[dto.type] ?? 'consultation',
    status: apiAppointmentStatusToUi[dto.status] ?? 'scheduled',
    notes: 'notes' in dto ? (dto.notes ?? undefined) : undefined,
  }
}

// ── Wards / Rooms / Beds ──────────────────────────────────────────────────

export function mapWardSummary(dto: WardSummaryDto): Ward {
  return { id: dto.id, name: dto.name, type: dto.type, totalBeds: dto.totalBeds, occupiedBeds: dto.occupiedBeds, floor: dto.floor }
}

export function mapWardFull(dto: WardDto): Ward {
  return mapWardSummary(dto)
}

function mapBedInRoom(dto: BedInRoomDto): Bed {
  return {
    id: dto.id,
    number: dto.bedNumber,
    status: apiBedStatusToUi[dto.status] ?? 'available',
    patientId: dto.patientId ?? undefined,
    patientName: dto.patientName ?? undefined,
  }
}

export function mapRoom(dto: RoomDto): Room {
  return {
    id: dto.id,
    wardId: dto.wardId,
    wardName: dto.wardName,
    roomNumber: dto.roomNumber,
    type: apiRoomTypeToUi[dto.type] ?? 'general',
    beds: dto.beds.map(mapBedInRoom),
  }
}

export function mapBed(dto: BedDto): Bed {
  return {
    id: dto.id,
    number: dto.bedNumber,
    status: apiBedStatusToUi[dto.status] ?? 'available',
    patientId: dto.patientId ?? undefined,
    patientName: dto.patientName ?? undefined,
  }
}

// ── Prescriptions ─────────────────────────────────────────────────────────

export function mapPrescription(dto: PrescriptionDto): Prescription {
  return {
    id: dto.id,
    patientId: dto.patientId,
    patientName: dto.patientName,
    doctorId: dto.doctorId,
    doctorName: dto.doctorName,
    visitId: dto.visitId,
    date: toDateInput(dto.issuedAt),
    medications: dto.medications.map((m) => ({
      name: m.name, dosage: m.dosage, frequency: m.frequency, duration: m.duration, instructions: m.instructions ?? undefined,
    })),
    notes: dto.notes ?? undefined,
    status: apiPrescriptionStatusToUi[dto.status] ?? 'active',
  }
}

// ── Visits ──────────────────────────────────────────────────────────────

export function mapVisit(dto: VisitDto): Visit {
  return {
    id: dto.id,
    patientId: dto.patientId,
    patientName: dto.patientName,
    doctorId: dto.doctorId,
    doctorName: dto.doctorName,
    admissionDate: toDateInput(dto.admissionDate),
    dischargeDate: dto.dischargeDate ? toDateInput(dto.dischargeDate) : undefined,
    diagnosis: dto.diagnosis,
    treatment: dto.treatment,
    status: dto.status === 'Discharged' ? 'discharged' : 'ongoing',
    prescriptions: dto.prescriptions?.map((p) => ({ id: p.id, medicationNames: p.medicationNames, status: apiPrescriptionStatusToUi[p.status] ?? 'active' })),
    labResults: dto.labResults?.map((l) => ({ id: l.id, testName: l.testName, result: l.result, status: apiLabStatusToUi[l.status] ?? 'normal' })),
  }
}

// ── Discharge summaries ────────────────────────────────────────────────────

export function mapDischargeSummary(dto: DischargeSummaryDto): DischargeSummary {
  return {
    id: dto.id,
    visitId: dto.visitId,
    patientId: dto.patientId,
    patientName: dto.patientName,
    doctorName: dto.doctorName,
    admissionDate: toDateInput(dto.admissionDate),
    dischargeDate: dto.dischargeDate ? toDateInput(dto.dischargeDate) : '',
    diagnosis: dto.diagnosis,
    treatment: dto.treatment,
    medications: [],
    followUpInstructions: dto.followUpInstructions,
    followUpDate: dto.followUpDate ?? undefined,
  }
}

// ── Lab results ─────────────────────────────────────────────────────────

export function mapLabResult(dto: LabResultDto): LabResult {
  return {
    id: dto.id,
    patientId: dto.patientId,
    patientName: dto.patientName,
    visitId: dto.visitId,
    testName: dto.testName,
    date: toDateInput(dto.testedAt),
    result: dto.result,
    normalRange: dto.normalRange,
    status: apiLabStatusToUi[dto.status] ?? 'normal',
    notes: dto.notes ?? undefined,
  }
}

// ── Messages ────────────────────────────────────────────────────────────

export function mapMessage(dto: MessageDto): Message {
  return {
    id: dto.id,
    senderId: dto.senderId,
    senderName: dto.senderName,
    receiverId: dto.receiverId,
    receiverName: dto.receiverName,
    content: dto.content,
    timestamp: dto.sentAt,
    read: dto.isRead,
  }
}

// ── Audit log ───────────────────────────────────────────────────────────

export function mapAuditLog(dto: AuditLogDto): AuditLog {
  const role = dto.userRole.toLowerCase()
  return {
    id: dto.id,
    userId: dto.userId,
    userName: dto.userName,
    userRole: (['admin', 'doctor', 'nurse', 'patient'].includes(role) ? role : 'admin') as AuditLog['userRole'],
    action: dto.action,
    resource: dto.resource,
    resourceId: dto.resourceId,
    timestamp: dto.timestamp,
    ipAddress: dto.ipAddress,
  }
}
