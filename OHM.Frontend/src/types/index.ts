export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Patient {
  id: string
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
}

export interface DischargeSummary {
  visitId: string
  patientId: string
  patientName: string
  doctorName: string
  admissionDate: string
  dischargeDate: string
  diagnosis: string
  treatment: string
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
