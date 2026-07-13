using HMS.Domain.Common;
using HMS.Domain.Enums;

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
    }
}
