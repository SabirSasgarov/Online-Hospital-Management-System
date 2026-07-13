using HMS.Domain.Common;
using HMS.Domain.Enums;

namespace HMS.Domain.Entities
{
    public class LabResult : AuditableEntity
    {
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Guid VisitId { get; set; }
        public Visit Visit { get; set; } = null!;

        // The staff member who ordered / entered the result (doctor or nurse)
        public Guid OrderedById { get; set; }
        public AppUser OrderedBy { get; set; } = null!;

        public string TestName { get; set; } = string.Empty;     // e.g. "HbA1c"
        public DateTime TestedAt { get; set; }
        public string Result { get; set; } = string.Empty;       // e.g. "7.2%"
        public string NormalRange { get; set; } = string.Empty;  // e.g. "<5.7%"
        public LabResultStatus Status { get; set; }
        public string? Notes { get; set; }
    }
}
