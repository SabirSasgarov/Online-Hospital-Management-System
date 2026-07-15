namespace HMS.Application.Beds.BedsDTOs
{
    // ── Response DTOs ────────────────────────────────────────────────────────

    public class BedDto
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public Guid WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public string BedNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public Guid? PatientId { get; set; }
        public string? PatientName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────

    public class CreateBedDto
    {
        public Guid RoomId { get; set; }
        public string BedNumber { get; set; } = string.Empty;
    }

    public class UpdateBedStatusDto
    {
        public BedStatus Status { get; set; }
    }

    public class AssignPatientToBedDto
    {
        public Guid PatientId { get; set; }
    }
}
