export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient'

export interface User {
  /** AppUser (Identity) id — what the JWT `sub`/UserId claim contains. */
  id: string
  /**
   * Doctor.Id or Patient.Id — the profile record id that Appointments, Visits,
   * Prescriptions etc. actually reference. Undefined for admin/nurse, who have
   * no dedicated profile entity. Resolved once after login (see AuthContext).
   */
  profileId?: string
  name: string
  email: string
  role: UserRole
  /** Permission claim strings from the user's role, e.g. "Permissions.Patients.View". */
  permissions: string[]
  avatar?: string
}

export interface Patient {
  id: string
  userId?: string
  name: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodType: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  conditions: string[]
  allergies: string[]
  registeredAt: string
  status: 'active' | 'admitted' | 'discharged'
}

export interface Doctor {
  id: string
  userId?: string
  name: string
  specialization: string
  email: string
  phone: string
  schedule: DoctorSchedule[]
  available: boolean
  rating: number
}

export interface DoctorSchedule {
  day: string
  startTime: string
  endTime: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
}

export interface Ward {
  id: string
  name: string
  type: string
  totalBeds: number
  occupiedBeds: number
  floor: number
}

export interface Room {
  id: string
  wardId: string
  wardName: string
  roomNumber: string
  type: 'single' | 'double' | 'icu' | 'general'
  beds: Bed[]
}

export interface Bed {
  id: string
  number: string
  status: 'available' | 'occupied' | 'maintenance'
  patientId?: string
  patientName?: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  visitId: string
  date: string
  medications: Medication[]
  notes?: string
  status: 'active' | 'completed' | 'cancelled'
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface Visit {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  admissionDate: string
  dischargeDate?: string
  diagnosis: string
  treatment: string
  status: 'ongoing' | 'discharged'
  /** Prescriptions/lab results linked to this visit, when fetched via GET /visit/{id}. */
  prescriptions?: { id: string; medicationNames: string[]; status: string }[]
  labResults?: { id: string; testName: string; result: string; status: string }[]
}

export interface DischargeSummary {
  id: string
  visitId: string
  patientId: string
  patientName: string
  doctorName: string
  admissionDate: string
  dischargeDate: string
  diagnosis: string
  treatment: string
  /** Not part of the discharge summary itself on the backend — populated from the visit's linked prescriptions when available. */
  medications: Medication[]
  followUpInstructions: string
  followUpDate?: string
}

export interface LabResult {
  id: string
  patientId: string
  patientName: string
  visitId: string
  testName: string
  date: string
  result: string
  normalRange: string
  status: 'normal' | 'abnormal' | 'critical'
  notes?: string
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  timestamp: string
  read: boolean
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  action: string
  resource: string
  resourceId: string
  timestamp: string
  ipAddress: string
}
