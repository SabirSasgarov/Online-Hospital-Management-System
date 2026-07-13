using HMS.Domain.Common;

namespace HMS.Domain.Entities
{
    public class Doctor : AuditableEntity
    {
        // Link to identity
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        // Professional info
        public string Specialization { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;

        // Navigation
        public ICollection<DoctorSchedule> Schedules { get; set; } = [];
        public ICollection<Appointment> Appointments { get; set; } = [];
        public ICollection<Visit> Visits { get; set; } = [];
        public ICollection<Prescription> Prescriptions { get; set; } = [];
        public ICollection<LabResult> LabResults { get; set; } = [];
        public ICollection<DischargeSummary> DischargeSummaries { get; set; } = [];
    }
}
