namespace HMS.Application.Appointments.AppointmentsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    /// <summary>Compact row for list/calendar views.</summary>
    public class AppointmentSummaryDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialization { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Full detail returned by GET /appointment/{id}.</summary>
    public class AppointmentDto : AppointmentSummaryDto
    {
        public string? Notes { get; set; }
        public string PatientEmail { get; set; } = string.Empty;
        public string DoctorEmail { get; set; } = string.Empty;
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    /// <summary>Patient or admin books a new appointment.</summary>
    public class CreateAppointmentDto
    {
        public Guid PatientId { get; set; }
        public Guid DoctorId { get; set; }
        public DateTime ScheduledAt { get; set; }
        public AppointmentType Type { get; set; }
        public string? Notes { get; set; }
    }

    /// <summary>Reschedule or change type/notes (not status).</summary>
    public class UpdateAppointmentDto
    {
        public DateTime ScheduledAt { get; set; }
        public AppointmentType Type { get; set; }
        public string? Notes { get; set; }
    }

    /// <summary>Explicit status transition — used by cancel and complete endpoints.</summary>
    public class ChangeAppointmentStatusDto
    {
        public AppointmentStatus Status { get; set; }
        public string? Reason { get; set; }  // optional cancellation/no-show reason stored in Notes
    }
}
