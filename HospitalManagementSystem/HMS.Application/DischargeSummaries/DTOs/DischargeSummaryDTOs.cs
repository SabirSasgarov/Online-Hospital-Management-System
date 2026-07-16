namespace HMS.Application.DischargeSummaries.DTOs
{
    public class DischargeSummaryDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
        public DateTime AdmissionDate { get; set; }
        public DateTime? DischargeDate { get; set; }
        public string FollowUpInstructions { get; set; } = string.Empty;
        public DateOnly? FollowUpDate { get; set; }
    }

    public class CreateDischargeSummaryDto
    {
        public Guid VisitId { get; set; }
        public string FollowUpInstructions { get; set; } = string.Empty;
        public DateOnly? FollowUpDate { get; set; }
    }

    public class UpdateDischargeSummaryDto
    {
        public string? FollowUpInstructions { get; set; }
        public DateOnly? FollowUpDate { get; set; }
    }
}
