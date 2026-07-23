namespace HMS.Domain.Entities
{
    public class Appointment : AuditableEntity
    {
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // Date and time are stored together so conflict detection is a simple overlap query
        public DateTime ScheduledAt { get; set; }

        public AppointmentType Type { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

        public string? Notes { get; set; }

        /// <summary>
        /// Set once a reminder email has been sent for this appointment (automatically ~1 day
        /// ahead, or manually by a nurse/admin) so the same appointment is never reminded twice.
        /// </summary>
        public DateTime? ReminderSentAt { get; set; }
    }
}
