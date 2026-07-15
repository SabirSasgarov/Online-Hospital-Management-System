namespace HMS.Application.Patients.PatientsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    /// <summary>Compact row used in list/search results.</summary>
    public class PatientSummaryDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public int Age => DateOnly.FromDateTime(DateTime.Today).Year - DateOfBirth.Year -
                         (DateOnly.FromDateTime(DateTime.Today).DayOfYear < DateOfBirth.DayOfYear ? 1 : 0);
        public string Gender { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string Conditions { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Full profile returned by GET /patients/{id}.</summary>
    public class PatientDto : PatientSummaryDto
    {
        public string Address { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
        public Guid? CurrentBedId { get; set; }
        public string? CurrentBedNumber { get; set; }
    }

    /// <summary>Medical history snapshot for GET /patients/{id}/medical-history.</summary>
    public class PatientMedicalHistoryDto
    {
        public Guid PatientId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public string Conditions { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
        public List<VisitSummaryDto> Visits { get; set; } = [];
        public List<PrescriptionSummaryDto> Prescriptions { get; set; } = [];
        public List<LabResultSummaryDto> LabResults { get; set; } = [];
    }

    public class VisitSummaryDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class PrescriptionSummaryDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<string> MedicationNames { get; set; } = [];
    }

    public class LabResultSummaryDto
    {
        public Guid Id { get; set; }
        public string TestName { get; set; } = string.Empty;
        public DateTime TestedAt { get; set; }
        public string Result { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    /// <summary>Admin creates a brand-new patient (user account + profile).</summary>
    public class CreatePatientDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string BloodType { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string Conditions { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
    }

    /// <summary>Patient (or admin) updates basic contact/personal info.</summary>
    public class UpdatePatientDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
    }

    /// <summary>Doctor / admin updates clinical data only.</summary>
    public class UpdateMedicalHistoryDto
    {
        public string BloodType { get; set; } = string.Empty;
        public string Conditions { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
    }
}
