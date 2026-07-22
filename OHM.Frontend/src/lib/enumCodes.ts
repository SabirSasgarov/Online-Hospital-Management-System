/**
 * The backend does not register a JsonStringEnumConverter, so any request-body
 * property whose C# type is an enum (not `string`) must be sent as its integer
 * ordinal — sending the string name throws a JSON deserialization error server-side.
 * Response DTOs are unaffected: the API always converts enums to strings itself
 * before mapping them into DTOs (see the AutoMapper profiles), so responses are
 * always plain strings and never need decoding here.
 *
 * These maps give the ordinal for every enum used in a request body.
 */

export const AppointmentTypeCode = {
  Consultation: 0,
  FollowUp: 1,
  Emergency: 2,
  Checkup: 3,
} as const

export const AppointmentStatusCode = {
  Scheduled: 0,
  Completed: 1,
  Cancelled: 2,
  NoShow: 3,
} as const

export const GenderCode = {
  Male: 0,
  Female: 1,
  Other: 2,
} as const

export const BedStatusCode = {
  Available: 0,
  Occupied: 1,
  Maintenance: 2,
} as const

export const RoomTypeCode = {
  Single: 0,
  Double: 1,
  ICU: 2,
  General: 3,
} as const

export const LabResultStatusCode = {
  Normal: 0,
  Abnormal: 1,
  Critical: 2,
} as const

export const PrescriptionStatusCode = {
  Active: 0,
  Completed: 1,
  Cancelled: 2,
} as const

/** .NET's built-in DayOfWeek enum: Sunday = 0 ... Saturday = 6 */
export const DayOfWeekCode = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
} as const
