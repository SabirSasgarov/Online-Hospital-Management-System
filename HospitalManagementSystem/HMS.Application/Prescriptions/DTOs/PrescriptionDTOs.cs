namespace HMS.Application.Prescriptions.DTOs
{
    public class PrescriptionMedicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string? Instructions { get; set; }
    }

    public class PrescriptionDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public List<PrescriptionMedicationDto> Medications { get; set; } = [];
    }

    public class PrescriptionSummaryDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<string> MedicationNames { get; set; } = [];
    }

    public class CreateMedicationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string? Instructions { get; set; }
    }

    public class CreatePrescriptionDto
    {
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public Guid DoctorId { get; set; }
        public string? Notes { get; set; }
        public List<CreateMedicationDto> Medications { get; set; } = [];
    }

    public class UpdatePrescriptionDto
    {
        public string? Notes { get; set; }
        public List<CreateMedicationDto>? Medications { get; set; }
    }

    public class ChangePrescriptionStatusDto
    {
        public PrescriptionStatus Status { get; set; }
    }
}
