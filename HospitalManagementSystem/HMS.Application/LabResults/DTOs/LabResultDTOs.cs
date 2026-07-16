namespace HMS.Application.LabResults.DTOs
{
    public class LabResultDto
    {
        public Guid Id { get; set; }
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string OrderedBy { get; set; } = string.Empty;
        public string TestName { get; set; } = string.Empty;
        public DateTime TestedAt { get; set; }
        public string Result { get; set; } = string.Empty;
        public string NormalRange { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class CreateLabResultDto
    {
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public Guid OrderedById { get; set; }
        public string TestName { get; set; } = string.Empty;
        public DateTime TestedAt { get; set; }
        public string Result { get; set; } = string.Empty;
        public string NormalRange { get; set; } = string.Empty;
        public LabResultStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateLabResultDto
    {
        public string? Result { get; set; }
        public string? NormalRange { get; set; }
        public LabResultStatus? Status { get; set; }
        public string? Notes { get; set; }
    }
}
