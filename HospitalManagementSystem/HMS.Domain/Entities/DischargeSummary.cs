using HMS.Domain.Common;

namespace HMS.Domain.Entities
{
    public class DischargeSummary : AuditableEntity
    {
        // One-to-one with Visit
        public Guid VisitId { get; set; }
        public Visit Visit { get; set; } = null!;

        // Denormalised for easy querying
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public string FollowUpInstructions { get; set; } = string.Empty;
        public DateOnly? FollowUpDate { get; set; }

        // The diagnosis and treatment come from the Visit; no need to duplicate them here.
        // Medications come from Prescriptions linked to the Visit.
        // If you ever need a PDF snapshot, generate it from Visit + Prescriptions at download time.
    }
}
