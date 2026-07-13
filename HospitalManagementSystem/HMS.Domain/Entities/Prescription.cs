using HMS.Domain.Common;
using HMS.Domain.Enums;

namespace HMS.Domain.Entities
{
    public class Prescription : AuditableEntity
    {
        public Guid VisitId { get; set; }
        public Visit Visit { get; set; } = null!;

        // Denormalised for easy querying without always joining through Visit
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
        public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Active;
        public string? Notes { get; set; }

        // Navigation
        public ICollection<PrescriptionMedication> Medications { get; set; } = [];
    }
}
