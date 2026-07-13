using HMS.Domain.Common;

namespace HMS.Domain.Entities
{
    public class PrescriptionMedication : BaseEntity
    {
        public Guid PrescriptionId { get; set; }
        public Prescription Prescription { get; set; } = null!;

        public string Name { get; set; } = string.Empty;         // e.g. "Lisinopril"
        public string Dosage { get; set; } = string.Empty;       // e.g. "10mg"
        public string Frequency { get; set; } = string.Empty;    // e.g. "Once daily"
        public string Duration { get; set; } = string.Empty;     // e.g. "30 days"
        public string? Instructions { get; set; }                 // e.g. "Take with water in the morning"
    }
}
