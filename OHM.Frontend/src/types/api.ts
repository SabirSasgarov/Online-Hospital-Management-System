/**
 * Types that mirror the HMS.API DTOs exactly (field names, casing, shapes).
 * These are what actually comes back over the wire / must be sent in requests.
 *
 * UI-friendly shapes used by the pages/components live in `./index.ts` — see
 * `src/lib/adapters.ts` for the mapping between the two.
 */

// ── Generic wrappers ──────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface Result<T = unknown> {
  succeeded: boolean
  message?: string | null
  data?: T
  errors?: string[]
}

// ── Enum string literals (as returned by the API; PascalCase) ────────────

export type ApiAppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow'
export type ApiAppointmentType = 'Consultation' | 'FollowUp' | 'Emergency' | 'Checkup'
export type ApiBedStatus = 'Available' | 'Occupied' | 'Maintenance'
export type ApiGender = 'Male' | 'Female' | 'Other'
export type ApiLabResultStatus = 'Normal' | 'Abnormal' | 'Critical'
export type ApiPrescriptionStatus = 'Active' | 'Completed' | 'Cancelled'
export type ApiRoomType = 'Single' | 'Double' | 'ICU' | 'General'
export type ApiVisitStatus = 'Ongoing' | 'Discharged'
export type ApiNotificationType =
  | 'AppointmentReminder'
  | 'AppointmentCancelled'
  | 'AppointmentCompleted'
  | 'PrescriptionIssued'
  | 'LabResultReady'
  | 'DischargeSummaryReady'
  | 'NewMessage'
  | 'General'

// ── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest {
  firstName: string; lastName: string; email: string; userName: string; password: string
}
export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { email: string; code: string; newPassword: string }
export interface ChangePasswordRequest { currentPassword: string; newPassword: string }

export interface AuthResponseDto {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: string
  userId: string
  email: string
  fullName: string
  roles: string[]
}

export interface RefreshTokenRequest { accessToken: string; refreshToken: string }
export interface ConfirmEmailRequest { email: string; code: string }
export interface ResendConfirmationRequest { email: string }
export interface GoogleSignInRequest { idToken: string }

// ── Profile ────────────────────────────────────────────────────────────────

export interface ProfileDto {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  profileImageUrl?: string | null
  emailConfirmed: boolean
  roles: string[]
}
export interface UpdateProfileRequest {
  firstName: string; lastName: string; phoneNumber?: string; profileImageUrl?: string
}
export interface ChangeEmailRequest { newEmail: string; currentPassword: string }
export interface ConfirmEmailChangeRequest { code: string }

// ── Staff accounts (admin-only) ─────────────────────────────────────────────

export interface StaffUserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl?: string | null
  isActive: boolean
  emailConfirmed: boolean
  roles: string[]
}
export interface CreateStaffUserRequest {
  firstName: string; lastName: string; email: string; password: string; role: 'Nurse' | 'Admin'
  profileImageUrl?: string
}

// ── Announcements (public site + admin CMS) ─────────────────────────────────

export interface AnnouncementDto {
  id: string
  title: string
  summary: string
  content: string
  imageUrl?: string | null
  isPublished: boolean
  publishedAt?: string | null
  author: string
  createdAt: string
}
export interface CreateAnnouncementRequest {
  title: string; summary: string; content: string; imageUrl?: string; isPublished: boolean
}
export interface UpdateAnnouncementRequest {
  title: string; summary: string; content: string; imageUrl?: string; isPublished: boolean
}

// ── Offers (public "What CareFlow Offers" section + admin CMS) ─────────────

export interface OfferDto {
  id: string
  title: string
  description: string
  icon: string
  displayOrder: number
  isActive: boolean
}
export interface CreateOfferRequest {
  title: string; description: string; icon: string; displayOrder: number; isActive: boolean
}
export interface UpdateOfferRequest {
  title: string; description: string; icon: string; displayOrder: number; isActive: boolean
}

// ── Public site ──────────────────────────────────────────────────────────────

export interface PublicDoctorDto {
  id: string
  fullName: string
  specialization: string
  profileImageUrl?: string | null
  isAvailable: boolean
}

// ── Patients ────────────────────────────────────────────────────────────

export interface PatientSummaryDto {
  id: string
  userId: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  age: number
  gender: ApiGender
  bloodType: string
  conditions: string
  isActive: boolean
  createdAt: string
}

export interface PatientDto extends PatientSummaryDto {
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  allergies: string
  currentBedId?: string | null
  currentBedNumber?: string | null
}

export interface VisitSummaryDto {
  id: string
  doctorName: string
  admissionDate: string
  dischargeDate?: string | null
  diagnosis: string
  status: ApiVisitStatus
}

export interface PrescriptionSummaryDto {
  id: string
  doctorName: string
  issuedAt: string
  status: ApiPrescriptionStatus
  medicationNames: string[]
}

export interface LabResultSummaryDto {
  id: string
  testName: string
  testedAt: string
  result: string
  status: ApiLabResultStatus
}

export interface PatientMedicalHistoryDto {
  patientId: string
  fullName: string
  bloodType: string
  conditions: string
  allergies: string
  visits: VisitSummaryDto[]
  prescriptions: PrescriptionSummaryDto[]
  labResults: LabResultSummaryDto[]
}

export interface CreatePatientRequest {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
  dateOfBirth: string
  gender: number // Gender enum ordinal
  bloodType: string
  phone: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
  conditions: string
  allergies: string
}

export interface UpdatePatientRequest {
  firstName: string
  lastName: string
  phone: string
  address: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export interface UpdateMedicalHistoryRequest {
  bloodType: string
  conditions: string
  allergies: string
}

// ── Doctors ─────────────────────────────────────────────────────────────

export interface DoctorScheduleDto {
  id: string
  day: string
  startTime: string // "HH:mm:ss"
  endTime: string
}

export interface DoctorSummaryDto {
  id: string
  userId: string
  fullName: string
  email: string
  phone: string
  specialization: string
  profileImageUrl?: string | null
  isAvailable: boolean
  isActive: boolean
  scheduleDays: string[]
  createdAt: string
}

export interface DoctorDto extends DoctorSummaryDto {
  schedules: DoctorScheduleDto[]
  totalAppointments: number
  activeVisits: number
}

export interface CreateDoctorScheduleRequest {
  day: number // DayOfWeek ordinal (Sunday = 0)
  startTime: string // "HH:mm:ss"
  endTime: string
}

export interface CreateDoctorRequest {
  firstName: string
  lastName: string
  email: string
  userName: string
  password: string
  specialization: string
  phone: string
  profileImageUrl?: string
  schedules: CreateDoctorScheduleRequest[]
}

export interface UpdateDoctorRequest {
  firstName: string
  lastName: string
  phone: string
  specialization: string
  profileImageUrl?: string
}

export interface UpdateDoctorScheduleRequest {
  schedules: CreateDoctorScheduleRequest[]
}

export interface UpdateDoctorAvailabilityRequest { isAvailable: boolean }

// ── Appointments ────────────────────────────────────────────────────────

export interface AppointmentSummaryDto {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorSpecialization: string
  scheduledAt: string
  type: ApiAppointmentType
  status: ApiAppointmentStatus
  createdAt: string
}

export interface AppointmentDto extends AppointmentSummaryDto {
  notes?: string | null
  patientEmail: string
  doctorEmail: string
}

export interface CreateAppointmentRequest {
  patientId: string
  doctorId: string
  scheduledAt: string
  type: number // AppointmentType ordinal
  notes?: string | null
}

export interface UpdateAppointmentRequest {
  scheduledAt: string
  type: number
  notes?: string | null
}

export interface ChangeAppointmentStatusRequest {
  status: number // AppointmentStatus ordinal
  reason?: string | null
}

// ── Visits ──────────────────────────────────────────────────────────────

export interface VisitDto {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorSpecialization: string
  bedId?: string | null
  bedNumber?: string | null
  admissionDate: string
  dischargeDate?: string | null
  diagnosis: string
  treatment: string
  status: ApiVisitStatus
  prescriptions: PrescriptionSummaryDto[]
  labResults: LabResultSummaryDto[]
}

export interface CreateVisitRequest {
  patientId: string
  doctorId: string
  bedId?: string | null
  admissionDate: string
  diagnosis: string
  treatment: string
}

export interface UpdateVisitRequest {
  doctorId?: string | null
  bedId?: string | null
  diagnosis?: string | null
  treatment?: string | null
}

export interface DischargeVisitRequest {
  dischargeDate: string
  finalDiagnosis?: string | null
  finalTreatment?: string | null
}

// ── Wards / Rooms / Beds ──────────────────────────────────────────────────

export interface RoomSummaryInWardDto {
  id: string
  roomNumber: string
  type: ApiRoomType
  totalBeds: number
  occupiedBeds: number
}

export interface WardSummaryDto {
  id: string
  name: string
  type: string
  floor: number
  totalRooms: number
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
  createdAt: string
}

export interface WardDto extends WardSummaryDto {
  rooms: RoomSummaryInWardDto[]
}

export interface CreateWardRequest { name: string; type: string; floor: number }
export interface UpdateWardRequest { name: string; type: string; floor: number }

export interface BedInRoomDto {
  id: string
  bedNumber: string
  status: ApiBedStatus
  patientId?: string | null
  patientName?: string | null
}

export interface RoomSummaryDto {
  id: string
  wardId: string
  wardName: string
  roomNumber: string
  type: ApiRoomType
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
  createdAt: string
}

export interface RoomDto extends RoomSummaryDto {
  beds: BedInRoomDto[]
}

export interface CreateRoomRequest { wardId: string; roomNumber: string; type: number /* RoomType ordinal */ }
export interface UpdateRoomRequest { roomNumber: string; type: number }

export interface BedDto {
  id: string
  roomId: string
  roomNumber: string
  wardId: string
  wardName: string
  bedNumber: string
  status: ApiBedStatus
  patientId?: string | null
  patientName?: string | null
  createdAt: string
}

export interface CreateBedRequest { roomId: string; bedNumber: string }
export interface UpdateBedStatusRequest { status: number /* BedStatus ordinal */ }
export interface AssignPatientToBedRequest { patientId: string }

// ── Prescriptions ─────────────────────────────────────────────────────────

export interface PrescriptionMedicationDto {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string | null
}

export interface PrescriptionDto {
  id: string
  visitId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  issuedAt: string
  status: ApiPrescriptionStatus
  notes?: string | null
  medications: PrescriptionMedicationDto[]
}

export interface CreateMedicationRequest {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string | null
}

export interface CreatePrescriptionRequest {
  visitId: string
  patientId: string
  doctorId: string
  notes?: string | null
  medications: CreateMedicationRequest[]
}

export interface UpdatePrescriptionRequest {
  notes?: string | null
  medications?: CreateMedicationRequest[] | null
}

export interface ChangePrescriptionStatusRequest { status: number /* PrescriptionStatus ordinal */ }

// ── Lab Results ─────────────────────────────────────────────────────────

export interface LabResultDto {
  id: string
  visitId: string
  patientId: string
  patientName: string
  orderedBy: string
  testName: string
  testedAt: string
  result: string
  normalRange: string
  status: ApiLabResultStatus
  notes?: string | null
}

export interface CreateLabResultRequest {
  visitId: string
  patientId: string
  orderedById: string
  testName: string
  testedAt: string
  result: string
  normalRange: string
  status: number // LabResultStatus ordinal
  notes?: string | null
}

export interface UpdateLabResultRequest {
  result?: string | null
  normalRange?: string | null
  status?: number | null
  notes?: string | null
}

// ── Discharge Summaries ────────────────────────────────────────────────────

export interface DischargeSummaryDto {
  id: string
  visitId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  diagnosis: string
  treatment: string
  admissionDate: string
  dischargeDate?: string | null
  followUpInstructions: string
  followUpDate?: string | null
}

export interface CreateDischargeSummaryRequest {
  visitId: string
  followUpInstructions: string
  followUpDate?: string | null
}

export interface UpdateDischargeSummaryRequest {
  followUpInstructions?: string | null
  followUpDate?: string | null
}

// ── Messages ────────────────────────────────────────────────────────────

export interface MessageDto {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  sentAt: string
  isRead: boolean
}

export interface SendMessageRequest { receiverId: string; content: string }

// ── Notifications ──────────────────────────────────────────────────────

export interface NotificationDto {
  id: string
  title: string
  content: string
  type: ApiNotificationType
  isRead: boolean
  createdAt: string
  relatedEntityId?: string | null
}

// ── Audit Log ───────────────────────────────────────────────────────────

export interface AuditLogDto {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  timestamp: string
}

// ── Dashboard ───────────────────────────────────────────────────────────

export interface RecentAppointmentDto {
  id: string
  patientName: string
  doctorName: string
  doctorSpecialization: string
  scheduledAt: string
  status: ApiAppointmentStatus
  type: ApiAppointmentType
}

export interface AdminDashboardDto {
  totalPatients: number
  totalDoctors: number
  totalAppointmentsToday: number
  ongoingVisits: number
  availableBeds: number
  occupiedBeds: number
  totalBeds: number
  pendingLabResults: number
  appointmentsThisWeek: number
  recentAppointments: RecentAppointmentDto[]
}

export interface DoctorDashboardDto {
  todayAppointments: number
  ongoingVisits: number
  pendingPrescriptions: number
  pendingLabResults: number
  todaySchedule: RecentAppointmentDto[]
}

export interface PatientDashboardDto {
  upcomingAppointments: number
  activePrescriptions: number
  unreadMessages: number
  unreadNotifications: number
  nextAppointment?: RecentAppointmentDto | null
}

// ── Analytics ───────────────────────────────────────────────────────────

export interface DailyCountDto { date: string; count: number }
export interface WardOccupancyDto { wardName: string; totalBeds: number; occupiedBeds: number; occupancyRate: number }
export interface SpecializationCountDto { specialization: string; count: number }
export interface ConditionCountDto { label: string; count: number }

export interface AdmissionsAnalyticsDto {
  totalAdmissions: number
  totalDischarges: number
  currentlyAdmitted: number
  averageLengthOfStayDays: number
  admissionsByDay: DailyCountDto[]
}

export interface BedOccupancyAnalyticsDto {
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
  maintenanceBeds: number
  occupancyRate: number
  byWard: WardOccupancyDto[]
}

export interface AppointmentsAnalyticsDto {
  totalAppointments: number
  scheduled: number
  completed: number
  cancelled: number
  noShow: number
  completionRate: number
  appointmentsByDay: DailyCountDto[]
  bySpecialization: SpecializationCountDto[]
}

export interface PatientConditionsAnalyticsDto {
  topDiagnoses: ConditionCountDto[]
  labResultStatuses: ConditionCountDto[]
  prescriptionStatuses: ConditionCountDto[]
}
