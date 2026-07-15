namespace HMS.Domain.Entities
{
    public class Patient : AuditableEntity
    {
        // Link to identity
        public Guid UserId { get; set; }
        public AppUser User { get; set; } = null!;

        // Personal info
        public DateOnly DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string BloodType { get; set; } = string.Empty;  // A+, O-, etc.
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        // Medical conditions and allergies
        public string Conditions { get; set; } = string.Empty;   // e.g. "Hypertension,Diabetes Type 2"
        public string Allergies { get; set; } = string.Empty;    // e.g. "Penicillin,Sulfa drugs"

        public ICollection<Appointment> Appointments { get; set; } = [];
        public ICollection<Visit> Visits { get; set; } = [];
        public ICollection<Prescription> Prescriptions { get; set; } = [];
        public ICollection<LabResult> LabResults { get; set; } = [];
        public Bed? CurrentBed { get; set; }  // null when not admitted
    }
}
