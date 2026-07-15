using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Visits.VisitsDTOs
{
    public class VisitDto
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialization { get; set; } = string.Empty;
        public Guid? BedId { get; set; }
        public string? BedNumber { get; set; }
        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<PrescriptionSummaryDto> Prescriptions { get; set; } = [];
        public List<LabResultSummaryDto> LabResults { get; set; } = [];
    }

    public class CreateVisitDto
    {
        public Guid PatientId { get; set; }
        public Guid DoctorId { get; set; }
        public Guid? BedId { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
    }

    public class UpdateVisitDto
    {
        public Guid? DoctorId { get; set; }
        public Guid? BedId { get; set; }
        public string? Diagnosis { get; set; }
        public string? Treatment { get; set; }
    }

    public class DischargeVisitDto
    {
        public DateTime DischargeDate { get; set; } = DateTime.UtcNow;
        public string? FinalDiagnosis { get; set; }
        public string? FinalTreatment { get; set; }
    }
}
