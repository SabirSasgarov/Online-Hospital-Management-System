namespace HMS.Domain.Entities
{
    public class Visit : AuditableEntity
    {
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        // The bed assigned for this visit (nullable — outpatient visits have no bed)
        public Guid? BedId { get; set; }
        public Bed? Bed { get; set; }

        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }

        public string Diagnosis { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;

        public VisitStatus Status { get; set; } = VisitStatus.Ongoing;

        // Navigation
        public ICollection<Prescription> Prescriptions { get; set; } = [];
        public ICollection<LabResult> LabResults { get; set; } = [];
        public DischargeSummary? DischargeSummary { get; set; }
    }
}
